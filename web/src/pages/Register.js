import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import HomeRegister from '../assets/img/HomeRegister.jpeg';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((previous) => !previous);
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
      <Box sx={{ maxWidth: 700 }}>
        <Paper variant="outlined" sx={{ p: 3, height: { xs: '100%', sm: 'auto' } }}>
          <Typography component="h1" variant="h4" align="center">
            Registrar
          </Typography>
          <Grid container spacing={3} sx={{ my: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField required id="firstName" name="firstName" label="Nombres" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="lastName" name="lastName" label="Apellidos" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="idCard" name="idCard" label="Cédula" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="phone" name="phone" label="Teléfono" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="email" name="email" label="Correo" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="password"
                name="password"
                label="Clave"
                fullWidth
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
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button variant="contained" fullWidth>
                Registrarse
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
