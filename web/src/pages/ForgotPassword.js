import { useState, useContext } from 'react';
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

import { LoadingContext } from '../store/context/LoadingGlobal';
import { SnackbarContext } from '../store/context/SnackbarGlobal';

import { sendRequest } from '../helpers/utils';

export const ForgotPassword = () => {
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [email, setEmail] = useState('');
  const [errorValidation, setErrorValidation] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = (emailValue) => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateEmail(email)) {
      handleLoading(true);
      const response = await sendRequest({
        urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/auth/forgot-password`,
        method: 'POST',
        data: { email }
      });
      handleLoading(false);

      if (response.error) {
        handleOpenSnackbar('error', 'Error !');
      } else {
        setSuccess(true);
      }
    } else {
      setErrorValidation('Correo invalido.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#e7e7e7',
        alignItems: 'center'
      }}>
      <Card sx={{ p: 4, m: 2 }}>
        {success ? (
          <Typography variant="h5">
            Se ha enviado un enlace a su correo para realizar el cambio de contraseña.
          </Typography>
        ) : (
          <Box>
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

                <FormHelperText error>{errorValidation} </FormHelperText>
              </FormControl>

              <Button type="submit" fullWidth variant="contained">
                Enviar
              </Button>
            </Box>
          </Box>
        )}
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
