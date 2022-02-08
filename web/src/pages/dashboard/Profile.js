import { useState } from 'react';

import {
  Box,
  TextField,
  Card,
  Typography,
  Button,
  FormControl,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

export const Profile = () => {
  const palabraClaveEliminarcuenta = 'confirmar-eliminación';

  const [showPassword, setShowPassoword] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [textDeleteAccount, setTextDeleteAccount] = useState('');

  const handleClickShowPassword = () => setShowPassoword((previous) => !previous);
  const handleclickDeleteDialog = (condition) => setOpenDeleteDialog(condition);
  const handleChangeDeleteText = ({ target: { value } }) => setTextDeleteAccount(value);

  return (
    <Box>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Perfil de usuario
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Email" value="cris@gmail.com" disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Cédula" value="0123456789" disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Nombres" value="Cristhian" disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Apellidos" value="Manzano" disabled />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Fecha de nacimiento" value="2020-01-01" disabled />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Teléfono" value="0987654321" />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                required
                label="Nueva contraseña"
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
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button type="submit" color="primary" fullWidth variant="contained" disabled>
              Actualizar
            </Button>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => handleclickDeleteDialog(true)}>
              Eliminar cuenta
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Dialog open={openDeleteDialog} onClose={() => handleclickDeleteDialog(false)}>
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingrese la palabra{' '}
            <Typography
              component="span"
              sx={{
                display: 'inline',
                fontWeight: 'bold'
              }}>{`"${palabraClaveEliminarcuenta}"`}</Typography>{' '}
            y de click en &quot;Confirmar&quot; para eliminar la cuenta de manera definitiva.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            placeholder={palabraClaveEliminarcuenta}
            onChange={handleChangeDeleteText}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleclickDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => handleclickDeleteDialog(false)}
            disabled={textDeleteAccount !== palabraClaveEliminarcuenta}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
