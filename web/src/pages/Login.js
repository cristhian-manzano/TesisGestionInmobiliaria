import { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link as MaterialLink,
  Paper,
  Box,
  Grid,
  IconButton,
  Typography,
  FormHelperText,
  FormControl
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ImageLogin from '../assets/img/HouseLogin.jpg';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
  .required();

export const Login = () => {
  const [showPassword, setShowPassoword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    // ready for submit
    console.log(data);
  };

  const handleClickShowPassword = () => {
    setShowPassoword((previous) => !previous);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${ImageLogin})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <TextField
                margin="normal"
                required
                id="email"
                label="Email"
                autoComplete="email"
                autoFocus
                {...register('email')}
              />
              <FormHelperText id="email" error>
                {errors.email?.message}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                margin="normal"
                required
                label="Contraseña"
                id="password"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      position="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />

              <FormHelperText id="password" error>
                {errors.password?.message}
              </FormHelperText>
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Iniciar sesión
            </Button>
          </Box>

          <Grid container>
            <Grid item xs>
              <MaterialLink component={RouterLink} to="/" variant="body2">
                ¿Olvidó la contraseña?
              </MaterialLink>
            </Grid>
            <Grid item>
              <MaterialLink component={RouterLink} to="/register" variant="body2">
                Registrarse
              </MaterialLink>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
            {'Copyright © '}
            <MaterialLink
              color="inherit"
              target="_blank"
              href="https://github.com/Cmanzano-dev/TesisGestionInmobiliaria">
              Tésis - gestión inmobiliaria
            </MaterialLink>{' '}
            {new Date().getFullYear()}.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
