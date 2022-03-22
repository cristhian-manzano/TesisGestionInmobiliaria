import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import moment from 'moment';

import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { es } from 'date-fns/locale';

// Routing
import { Link as RouterLink } from 'react-router-dom';

// Loading and snackbar
import { LoadingContext } from '../store/context/LoadingGlobal';
import { SnackbarContext } from '../store/context/SnackbarGlobal';

// Image
import HomeRegister from '../assets/img/HomeRegister.jpeg';

// Utilities
import { registerScheme } from '../schemas/auth';
import { sendRequest } from '../helpers/utils';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  // react hook forms
  const {
    reset, // Testing reset
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerScheme),
    defaultValues: {
      // roles: [],
      dateOfBirth: new Date(moment().subtract(18, 'years').calendar())
    }
  });

  const fetchRoles = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/role`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Error al obtener roles');
    } else {
      setRoles(response.data?.data);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    const dataUser = {
      ...data,
      dateOfBirth: data.dateOfBirth.toLocaleDateString(),
      roles: [data.role]
      // roles: data.roles.map((role) => role.id)
    };

    delete dataUser.role;

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/auth/signup`,
      method: 'POST',
      data: dataUser
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo registrar el usuario!');
    } else {
      handleOpenSnackbar('success', 'Usuario registrado!');
      reset();
    }
  };

  const handleClickShowPassword = () => setShowPassword((previous) => !previous);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${HomeRegister})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <Box sx={{ maxWidth: 700 }} component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Paper variant="outlined" sx={{ p: 3, height: { xs: '100%', sm: 'auto' } }}>
          <Typography component="h1" variant="h4" align="center">
            Registrar
          </Typography>

          <Grid container spacing={3} sx={{ my: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField required id="firstName" label="Nombres" {...register('firstName')} />
                <FormHelperText error>{errors.firstName?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField required id="lastName" label="Apellidos" {...register('lastName')} />
                <FormHelperText error>{errors.lastName?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField required id="idCard" label="Cédula" {...register('idCard')} />
                <FormHelperText error>{errors.idCard?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField required id="phone" label="Teléfono" {...register('phone')} />
                <FormHelperText error>{errors.phone?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de nacimiento"
                        value={field.value}
                        onChange={field.onChange}
                        maxDate={new Date(moment().subtract(18, 'years').calendar())}
                        minDate={new Date(1920, 1, 1)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormHelperText error>{errors.dateOfBirth?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="multiple-roles-checkbox">Tipo de usuario</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId="multiple-roles-checkbox"
                        label="Tipo de usuario"
                        defaultValue=""
                        value={field.value ?? ''}
                        onChange={field.onChange}>
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    );
                  }}
                />
                <FormHelperText error>{errors.role?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField required id="email" label="Correo" {...register('email')} />
                <FormHelperText error>{errors.email?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  required
                  id="password"
                  label="Clave"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText error>{errors.password?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button variant="contained" type="submit" fullWidth>
                Registrarse
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button component={RouterLink} to="/login" color="inherit" sx={{ mt: 3, opacity: 0.6 }}>
              <ArrowBack />
              Iniciar sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
