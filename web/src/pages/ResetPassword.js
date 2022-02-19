import { useState } from 'react';
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

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = (event) => setPassword(event.target.value);
  const handleChangeRepeatPassword = (event) => setRepeatPassword(event.target.value);
  const handleShowPassword = (event) => setShowPassword(event.target.checked);

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
        <Box sx={{ my: 2, maxWidth: '500px' }}>
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

            <FormHelperText error>Contraseña invalida</FormHelperText>
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

            <FormHelperText error>Contraseña invalida</FormHelperText>
          </FormControl>

          <FormControlLabel
            control={<Checkbox checked={showPassword} onChange={handleShowPassword} />}
            label="Mostrar contraseñas"
          />

          <Button sx={{ my: 2 }} fullWidth variant="contained">
            Enviar
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
