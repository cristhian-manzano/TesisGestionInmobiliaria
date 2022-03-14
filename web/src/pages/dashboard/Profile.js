import { useState, useEffect, useContext } from 'react';

import {
  Box,
  TextField,
  Card,
  Typography,
  Button,
  FormControl,
  Grid,
  IconButton,
  Link,
  Avatar,
  FormHelperText
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
} from '@mui/material';

import { useForm } from 'react-hook-form';
import { Visibility, VisibilityOff, Delete, Upload } from '@mui/icons-material';

import { AuthContext } from '../../store/context/authContext';
import { LoadingContext } from '../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../store/context/SnackbarGlobal';
import { sendRequest } from '../../helpers/utils';

// const profileData = {
//   email: 'cri@gmail.com',
//   idCard: '123456789',
//   firstName: 'Cristhian Steven',
//   lastName: 'Manzano Manzano',
//   dateOfBirth: '2020-01-01',
//   phone: '0123456334',
//   profileImage:
//     'https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'
// };

export const Profile = () => {
  // const palabraClaveEliminarcuenta = 'confirmar-eliminación'; --> Implement
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [textDeleteAccount, setTextDeleteAccount] = useState('');
  // const [imageProfile, setImageProfile] = useState(null);

  const [showPassword, setShowPassoword] = useState(false);
  const [profileData, setProfileData] = useState({});

  // Contexts
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const handleClickShowPassword = () => setShowPassoword((previous) => !previous);

  const {
    register,
    reset,
    handleSubmit,
    formState: { dirtyFields, errors, isDirty }
  } = useForm();

  // const fetchProfile = () => {
  //   reset({
  //     email: profileData?.email,
  //     idCard: profileData?.idCard,
  //     firstName: profileData?.firstName,
  //     lastName: profileData?.lastName,
  //     dateOfBirth: profileData?.dateOfBirth,
  //     phone: profileData?.phone,
  //     password: ''
  //   });
  //   setImageProfile({ url: profileData?.profileImage });
  // };

  const fetchUser = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/user/profile`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener la información');
    } else {
      console.log(response.data.data);
      setProfileData(response.data.data);
      reset(response.data.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // const handleClickProfileUpload = (e) => {
  //   if (imageProfile) {
  //     e.preventDefault();
  //     setImageProfile(null);
  //   }
  // };

  // const handleChangeProfileUpload = (e) => {
  //   const newImage = e.target?.files?.[0];

  //   if (newImage)
  //     setImageProfile({
  //       file: newImage,
  //       url: URL.createObjectURL(newImage)
  //     });

  //   e.target.value = null;
  // };

  const onSubmit = async (data) => {
    const dataToSend = {};

    Object.keys(dirtyFields).forEach((key) => {
      dataToSend[key] = data[key];
    });

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/user/profile`,
      method: 'POST',
      token: authSession.user?.token,
      data: dataToSend
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo actualizar!');
    } else {
      handleOpenSnackbar('success', 'Actualizado exitosamente!');
      fetchUser();
    }
  };

  // const handleclickDeleteDialog = (condition) => setOpenDeleteDialog(condition);
  // const handleChangeDeleteText = ({ target: { value } }) => setTextDeleteAccount(value);

  return (
    <Box>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Perfil de usuario
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={12}>
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
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  {...register('email')}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Cédula"
                  {...register('idCard')}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nombres"
                  {...register('firstName')}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Apellidos"
                  {...register('lastName')}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Fecha de nacimiento"
                  {...register('dateOfBirth')}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Teléfono"
                  {...register('phone')}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nueva contraseña"
                  {...register('password', { minLength: 6 })}
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
                <FormHelperText error>
                  {errors.password?.type === 'minLength' && 'Debe tener mínimo 6 caracteres.'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                color="primary"
                fullWidth
                variant="contained"
                // disabled={!imageProfile?.file && !isDirty}>
                disabled={!isDirty}>
                Actualizar
              </Button>
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => handleclickDeleteDialog(true)}>
                Eliminar cuenta
              </Button>
            </Grid> */}
          </Grid>
        </Box>
      </Card>

      {/* <Dialog open={openDeleteDialog} onClose={() => handleclickDeleteDialog(false)}>
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
      </Dialog> */}
    </Box>
  );
};
