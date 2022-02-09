import { useState, useEffect } from 'react';

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
  DialogTitle,
  Link,
  Avatar
} from '@mui/material';

import { Visibility, VisibilityOff, Delete, Upload } from '@mui/icons-material';

const profileData = {
  email: 'cri@gmail.com',
  idCard: '123456789',
  firstName: 'Cristhian Steven',
  lastName: 'Manzano Manzano',
  dateOfBirth: '2020-01-01',
  phone: '0123456334',
  profileImage:
    'https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'
};

export const Profile = () => {
  const palabraClaveEliminarcuenta = 'confirmar-eliminación';

  const [user, setUser] = useState(null);
  const [showPassword, setShowPassoword] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [textDeleteAccount, setTextDeleteAccount] = useState('');
  const [imageProfile, setImageProfile] = useState(null);

  const handleClickShowPassword = () => setShowPassoword((previous) => !previous);
  const handleclickDeleteDialog = (condition) => setOpenDeleteDialog(condition);
  const handleChangeDeleteText = ({ target: { value } }) => setTextDeleteAccount(value);

  useEffect(() => {
    // Load user Data
    setUser(profileData);
    // Load image
    setImageProfile({ url: profileData.profileImage });
  }, []);

  const handleClickProfileUpload = (e) => {
    if (imageProfile) {
      e.preventDefault();
      setImageProfile(null);
    }
  };

  const handleChangeProfileUpload = (e) => {
    const newImage = e.target?.files?.[0];

    if (newImage)
      setImageProfile({
        file: newImage,
        url: URL.createObjectURL(newImage)
      });

    e.target.value = null;
  };

  return (
    <Box>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Perfil de usuario
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                m: 1
              }}>
              <Link href={imageProfile?.url} target="_blank" rel="noopener">
                <Avatar
                  alt="Remy Sharp"
                  src={imageProfile?.url || ''}
                  sx={{ width: 120, height: 120, m: 1 }}
                />
              </Link>

              <input
                accept="image/*"
                hidden
                id="avatar-image-upload"
                type="file"
                onChange={handleChangeProfileUpload}
              />
              <label htmlFor="avatar-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  mb={2}
                  onClick={handleClickProfileUpload}>
                  {imageProfile?.url ? <Delete mr={2} /> : <Upload mr={2} />}
                  {imageProfile?.url ? 'Limpiar' : 'Subir'}
                </Button>
              </label>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Email" value={user?.email ?? '-'} disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Cédula" value={user?.idCard ?? '-'} disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Nombres" value={user?.firstName ?? '-'} disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Apellidos" value={user?.lastName ?? '-'} disabled />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField label="Fecha de nacimiento" value={user?.dateOfBirth ?? '-'} disabled />
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
