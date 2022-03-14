import { useState, useEffect, useContext } from 'react';

import { Link as RouterLink, useParams } from 'react-router-dom';

import {
  Box,
  TextField,
  Card,
  Typography,
  Button,
  FormControl,
  Grid,
  FormHelperText
} from '@mui/material';

import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';

import { useForm, Controller } from 'react-hook-form';
import { ArrowBack } from '@mui/icons-material';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';

export const Update = () => {
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [textDeleteAccount, setTextDeleteAccount] = useState('');

  const { id } = useParams();
  // Contexts
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [updateUser, setUpdateUser] = useState({});

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { dirtyFields, errors, isDirty }
  } = useForm();

  const fetchUser = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/user/${id}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener el usuario');
    } else {
      setUpdateUser(response.data.data);
      reset(response.data.data);
    }
  };

  useEffect(() => fetchUser(), [id]);

  const onSubmit = async (data) => {
    const dataToSend = {};

    Object.keys(dirtyFields).forEach((key) => {
      dataToSend[key] = data[key];
    });

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/user/admin/${id}`,
      method: 'PUT',
      token: authSession.user?.token,
      data: dataToSend
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo actualizar!');
    } else {
      handleOpenSnackbar('success', 'Actualizado exitosamente!');
      fetchUser();
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

      <Card sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Actualizar usuario
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  {...register('email', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormHelperText error>{errors.email && 'email is required'}</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Cédula"
                  {...register('idCard', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormHelperText error>{errors.idCard && 'idCard is required'}</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nombres"
                  {...register('firstName', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormHelperText error>{errors.firstName && 'firstName is required'}</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Apellidos"
                  {...register('lastName', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormHelperText error>{errors.lastName && 'lastName is required'}</FormHelperText>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="dateOfBirth"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Fecha de nacimiento"
                        value={field.value ?? null}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>
                  {errors.dateOfBirth && 'dateOfBirth is required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Teléfono"
                  {...register('phone', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormHelperText error>{errors.phone && 'phone is required'}</FormHelperText>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                color="primary"
                fullWidth
                variant="contained"
                disabled={!isDirty}>
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
