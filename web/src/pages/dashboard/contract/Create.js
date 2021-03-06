import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { es } from 'date-fns/locale';

import moment from 'moment';

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
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  const [contractFile, setContractFile] = useState(null);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [tenantsRent, setTenantsRent] = useState([]);

  const [rangeDates, setRangeDates] = useState({
    minDate: null,
    maxDate: null
  });

  const changeRangeDates = (e) => {
    if (e) {
      setRangeDates((previous) => ({
        ...previous,
        minDate: new Date(moment(e).add(1, 'M').format())
      }));
    }
  };

  const fetchTenantsRent = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener los inquilinos');
    } else {
      const data = response.data?.data.filter((d) => d.endDate === null) ?? [];
      setTenantsRent(data);
    }
  };

  useEffect(() => {
    fetchTenantsRent();
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm();

  const onSubmit = async (dataForm) => {
    const dataToSend = {
      ...dataForm,
      ...(contractFile && { contractFile: contractFile.file })
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
      setContractFile(null);
    }
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (parseFloat(file.size / 1024 ** 2) > 5) return;

    setContractFile({
      id: `${file.name}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file
    });

    e.target.value = null;
  };

  const onDeleteContractFile = () => {
    setContractFile(null);
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
                      rules={{ required: { value: true, message: 'Alquiler requerido.' } }}
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

                    <FormHelperText error>{errors.idRent?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <Controller
                    name="startDate"
                    rules={{ required: { value: true, message: 'Fecha de inicio requerida.' } }}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de inicio"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          changeRangeDates(e);
                        }}
                        maxDate={new Date()}
                        minDate={new Date(moment().subtract(5, 'years').calendar())}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>{errors.startDate?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <Controller
                    name="endDate"
                    rules={{ required: { value: true, message: 'Fecha de fin requerida.' } }}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de fin"
                        value={field.value}
                        onChange={field.onChange}
                        minDate={rangeDates.minDate}
                        maxDate={new Date(moment().add(5, 'years').calendar())}
                        disabled={!rangeDates.minDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormHelperText error>{errors.endDate?.message}</FormHelperText>
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
                      accept=".pdf"
                      onChange={uploadFile}
                    />
                    <Button variant="outlined" component="span">
                      <Add />
                      {/* Agregar */}
                    </Button>
                  </label>
                </Box>

                {contractFile && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1
                    }}>
                    <Link href={contractFile?.url} target="_blank" rel="noopener">
                      {contractFile?.file.name}
                    </Link>
                    <IconButton color="error" aria-label="delete" onClick={onDeleteContractFile}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <FormHelperText>
                Formatos permitidos: .pdf - Tama??o m??ximo de documento permitido: 5MB
              </FormHelperText>
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
