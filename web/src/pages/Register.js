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
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Routing
import { Link as RouterLink } from 'react-router-dom';

// Loading and snackbar
import { LoadingContext } from '../store/context/LoadingGlobal';
import { SnackbarContext } from '../store/context/SnackbarGlobal';

// Image
import HomeRegister from '../assets/img/HomeRegister.jpeg';

// Utilities

import { sendRequest } from '../helpers/utils';
import { registerScheme } from '../schemas/auth';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);

  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  // react hook forms
  const {
    reset, // Testing reset
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerScheme)
  });

  const handleClickShowPassword = () => {
    setShowPassword((previous) => !previous);
  };

  useEffect(() => {
    sendRequest({ urlPath: '/role', method: 'GET' }).then((rolesData) => {
      setRoles(rolesData.data.data);
    });
  }, []);

  const onSubmit = async (data) => {
    handleLoading(true);
    const response = await sendRequest({ urlPath: '/auth/signup', method: 'post', data });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', response.message);
    } else {
      reset();
      handleOpenSnackbar('success', 'Usuario registrado exitosamente!');
    }
  };

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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  label="Rol"
                  {...register('idRole')}
                  defaultValue={0}>
                  <MenuItem value={0} disabled>
                    Seleccionar
                  </MenuItem>
                  {roles?.map((rol) => (
                    <MenuItem key={rol.id} value={rol.id}>
                      {rol.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{errors.idRole?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button variant="contained" type="submit" fullWidth>
                Registrarse
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="secondary"
                fullWidth>
                Logearse
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
