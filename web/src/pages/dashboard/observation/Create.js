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
  FormHelperText
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material/';
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
      setTenantsRent(response.data.data);
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
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/observation`,
      method: 'POST',
      token: authSession.user?.token,
      data: dataForm
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear la observación!');
    } else {
      handleOpenSnackbar('success', 'Observación creada exitosamente!');
      reset();
    }
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
                      rules={{ required: true }}
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

                    <FormHelperText error>
                      {formState.errors?.idRent && 'Alquiler required'}
                    </FormHelperText>
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
                  {...register('description', { required: true, maxLength: 300 })}
                  maxRows={20}
                  minRows={5}
                  inputProps={{ maxLength: 2000 }}
                />
                <FormHelperText error>
                  {formState.errors.description?.type === 'required' && 'Description required'}
                  {formState.errors.description?.type === 'maxLength' &&
                    'Description maxlength 300'}
                </FormHelperText>
              </FormControl>
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
