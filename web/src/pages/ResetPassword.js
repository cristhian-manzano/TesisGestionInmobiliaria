import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Card,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  FormHelperText,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Lock } from '@mui/icons-material';

import { LoadingContext } from '../store/context/LoadingGlobal';
import { SnackbarContext } from '../store/context/SnackbarGlobal';
import { sendRequest } from '../helpers/utils';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = (event) => setPassword(event.target.value);
  const handleChangeRepeatPassword = (event) => setRepeatPassword(event.target.value);
  const handleShowPassword = (event) => setShowPassword(event.target.checked);

  const validateSubmit = () => {
    if (password.length < 6 || password.length > 30 || password !== repeatPassword) {
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/auth/reset-password`,
      method: 'POST',
      data: { password, token }
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Error !');
    } else {
      handleOpenSnackbar('success', 'Password changed!');
      navigate('/login');
    }
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
        <Typography variant="h5">Cambiar contraseña</Typography>
        <Typography variant="body" color="text.secondary">
          Por favor, ingrese la nueva contraseña.
        </Typography>
        <Box sx={{ my: 2, maxWidth: '500px' }} component="form" onSubmit={onSubmit}>
          <FormControl sx={{ my: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleChangePassword}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
            />

            {/* <FormHelperText error>Contraseña invalida</FormHelperText> */}
          </FormControl>

          <FormControl sx={{ my: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-email">Repetir contraseña</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email"
              label="Repetir contraseña"
              type={showPassword ? 'text' : 'password'}
              value={repeatPassword}
              onChange={handleChangeRepeatPassword}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
            />

            {/* <FormHelperText error>Contraseña invalida</FormHelperText> */}
          </FormControl>

          <FormHelperText>
            *Longitud de caracteres minima de 6 caracteres y máxima de 30 caracteres.
          </FormHelperText>

          <FormControlLabel
            control={<Checkbox checked={showPassword} onChange={handleShowPassword} />}
            label="Mostrar contraseñas"
          />

          <Button
            sx={{ my: 2 }}
            // onClick={onSubmit}
            type="submit"
            fullWidth
            variant="contained"
            disabled={!validateSubmit()}>
            Enviar
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
