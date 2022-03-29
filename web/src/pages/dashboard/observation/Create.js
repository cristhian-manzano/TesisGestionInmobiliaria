import { useState, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Grid,
  TextField,
  Card,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormHelperText,
  Link,
  IconButton
} from '@mui/material';

import { ArrowBack, Add, Delete } from '@mui/icons-material/';
import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Create = () => {
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [tenantsRent, setTenantsRent] = useState([]);
  const { register, handleSubmit, control, reset, formState } = useForm();

  const [imageObservation, setImageObservation] = useState(null);

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

  const fetchTenantsRentByTenant = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/tenant`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener las rentas');
    } else {
      setTenantsRent(response.data.data);
    }
  };

  useEffect(() => {
    if (authSession.user?.roles.includes('Arrendador')) fetchTenantsRent();
    if (authSession.user?.roles.includes('Arrendatario')) fetchTenantsRentByTenant();
  }, []);

  const onSubmitForm = async (dataForm) => {
    const dataToSend = {
      ...dataForm,
      ...(imageObservation && { observationImage: imageObservation.file })
    };
    const formData = new FormData();
    Object.keys(dataToSend).forEach((key) => formData.append(key, dataToSend[key]));
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/observation`,
      method: 'POST',
      token: authSession.user?.token,
      data: formData,
      isFormData: true
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear la observación!');
    } else {
      handleOpenSnackbar('success', 'Observación creada exitosamente!');
      reset();
      setImageObservation(null);
    }
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (parseFloat(file.size / 1024 ** 2) > 5) return;

    setImageObservation({
      id: `${file.name}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file
    });

    e.target.value = null;
  };

  const onDeleteImageObservation = () => {
    setImageObservation(null);
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
      <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ my: 2 }}>
            Crear observación
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

                          {tenantsRent.map((rent) => (
                            <MenuItem key={rent.id} value={rent.id}>
                              {`${rent.property?.tagName ?? ''} - ${rent.tenant?.firstName ?? ''} ${
                                rent.tenant?.lastName ?? ''
                              }`}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    <FormHelperText error>{formState.errors?.idRent?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <TextField
                  name="description"
                  label="Descripción"
                  placeholder="Agregar descripción de inmueble..."
                  multiline
                  {...register('description', {
                    required: { value: true, message: 'Description requerida.' },
                    maxLength: { value: 300, message: 'Longitud máxima de caracteres: 300' }
                  })}
                  maxRows={20}
                  minRows={5}
                />
                <FormHelperText error>{formState.errors.description?.message}</FormHelperText>
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
                  <Typography variant="h5">Imagen</Typography>

                  <label htmlFor="btn-upload">
                    <input
                      type="file"
                      id="btn-upload"
                      style={{ display: 'none' }}
                      accept=".jpg, .jpeg, .png"
                      onChange={uploadFile}
                    />
                    <Button variant="outlined" component="span">
                      <Add />
                      {/* Agregar */}
                    </Button>
                  </label>
                </Box>

                {imageObservation && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1
                    }}>
                    <Link href={imageObservation?.url} target="_blank" rel="noopener">
                      {imageObservation?.file.name}
                    </Link>
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={onDeleteImageObservation}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <FormHelperText>
                Formatos permitidos: .jpg, .jpeg, .png - Tamaño máximo de documento permitido: 5MB
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
