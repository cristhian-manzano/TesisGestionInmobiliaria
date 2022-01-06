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
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ImageLogin from '../assets/img/HouseLogin.jpg';

const Copyright = () => {
  return (
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
  );
};

export const Login = () => {
  const [showPassword, setShowPassoword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassoword((previous) => !previous);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password')
    // });
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              id="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Iniciar sesión
            </Button>
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
            <Copyright />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
