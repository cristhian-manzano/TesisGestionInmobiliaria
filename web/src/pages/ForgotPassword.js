import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  FormHelperText
} from '@mui/material';

import { Email, ArrowBack } from '@mui/icons-material';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#e7e7e7',
        alignItems: 'center'
      }}>
      <Card sx={{ p: 4, m: 2 }}>
        <Typography variant="h5">Recuperar contraseña</Typography>
        <Typography variant="body" color="text.secondary">
          Por favor, ingrese el correo de la cuenta que desea recuperar.
        </Typography>
        <Box>
          <FormControl sx={{ my: 2 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email"
              label="Email"
              value={email}
              onChange={handleChangeEmail}
              placeholder="example@email.com"
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
            />

            <FormHelperText error>Correo invalido</FormHelperText>
          </FormControl>

          <Button fullWidth variant="contained">
            Enviar
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4
          }}>
          <Button component={RouterLink} to="/login" color="inherit" sx={{ opacity: 0.6 }}>
            <ArrowBack />
            Regresar al login
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
