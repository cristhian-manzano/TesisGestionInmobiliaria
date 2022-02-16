import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import {
  Box,
  Grid,
  TextField,
  Card,
  Typography,
  FormControl,
  Button,
  FormHelperText,
  IconButton,
  Link,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';

import { ArrowBack, Add, Delete } from '@mui/icons-material/';

import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { AuthContext } from '../../../store/context/authContext';

import { useTenantRent } from '../tenant/useTenantRent';
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  const [paymentFile, setPaymentFile] = useState(null);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const { api, data: tenantsRent, error, loading } = useTenantRent();

  useEffect(() => {
    handleLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    api.getAll();
    if (error) handleOpenSnackbar('error', 'Cannot get rents');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (dataForm) => {
    const dataToSend = {
      ...dataForm,
      ...(paymentFile && { contractFile: paymentFile.file })
    };
    const formData = new FormData();
    Object.keys(dataToSend).forEach((key) => formData.append(key, dataToSend[key]));
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/contracts`,
      method: 'POST',
      token: authSession.user?.token,
      data: formData,
      isFormData: true
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear el contrato!');
    } else {
      handleOpenSnackbar('success', 'Contrato creado exitosamente!');
      reset();
      setPaymentFile(null);
    }
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];

    setPaymentFile({
      id: `${file.name}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file
    });

    e.target.value = null;
  };

  const onDeletPaymentFile = () => {
    setPaymentFile(null);
  };

  return (
    <Box>
      <Button
        component={RouterLink}
        to="../"
        color="inherit"
        sx={{ opacity: 0.7, my: 1 }}
        aria-label="Example">
        <ArrowBack /> regresar
      </Button>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Crear contrato
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="rent-select">Alquileres</InputLabel>
                    <Controller
                      name="idRent"
                      control={control}
                      rules={{ required: true }}
                      defaultValue=""
                      render={({ field }) => (
                        <Select labelId="rent-select" label="Alquileres" {...field}>
                          <MenuItem value={0} disabled>
                            Seleccionar
                          </MenuItem>

                          {tenantsRent?.map((rent) => (
                            <MenuItem key={rent.id} value={rent.id}>
                              {`${rent.property?.tagName ?? ''} - ${rent.tenant?.firstName ?? ''} ${
                                rent.tenant?.lastName ?? ''
                              }`}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    <FormHelperText error>{errors?.idRent && 'Alquiler required'}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="startDate"
                    rules={{ required: true }}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de inicio"
                        value={field.value}
                        onChange={field.onChange}
                        maxDate={new Date()}
                        minDate={new Date(1900, 1, 1)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>
                  {errors.startDate?.type === 'required' && 'Fecha de inicio required'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="endDate"
                    rules={{ required: true }}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de fin"
                        value={field.value}
                        onChange={field.onChange}
                        maxDate={new Date()}
                        minDate={new Date(1900, 1, 1)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormHelperText error>
                  {errors.endDate?.type === 'required' && 'Fecha de fin required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Box sx={{ p: 2, border: '1px solid #DDDDDD' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    my: 1
                  }}>
                  <Typography variant="h5">Contrato</Typography>

                  <label htmlFor="btn-upload">
                    <input
                      type="file"
                      id="btn-upload"
                      style={{ display: 'none' }}
                      accept=".jpg, .jpeg, .png, .pdf"
                      onChange={uploadFile}
                    />
                    <Button variant="outlined" component="span">
                      <Add />
                      {/* Agregar */}
                    </Button>
                  </label>
                </Box>

                {paymentFile && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1
                    }}>
                    <Link href={paymentFile?.url} target="_blank" rel="noopener">
                      {paymentFile?.file.name}
                    </Link>
                    <IconButton color="error" aria-label="delete" onClick={onDeletPaymentFile}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button type="submit" fullWidth variant="contained">
                Crear
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
