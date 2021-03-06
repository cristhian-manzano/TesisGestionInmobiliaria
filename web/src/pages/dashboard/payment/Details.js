import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Chip,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  TextField,
  FormHelperText,
  DialogActions
} from '@mui/material';
import { ArrowBack, Clear } from '@mui/icons-material/';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';
import { ModalIframe } from '../../../components/ModalIframe';
import { Alert } from '../../../components/Alert';

export const Details = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);

  const [openCommentDialog, setOpenCommentDialog] = useState(false);

  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [alert, setAlert] = useState({ open: false, title: '', description: '' });

  const [deleteObservationAlert, setDeleteObservationAlert] = useState({
    open: false,
    title: '',
    description: ''
  });

  const { register, handleSubmit, reset, formState } = useForm();

  const [modalFile, setModalFile] = useState({
    open: false,
    url: ''
  });

  const handleOpenCommentDialog = (condition) => {
    setOpenCommentDialog(condition);
    // reset(); // Clear Form
  };

  const openValidatePaymentAlert = () => {
    setAlert({
      open: true,
      title: `¿Está seguro que desea validar el pago?`,
      description:
        'Al aceptar se validará el pago de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const openDeleteObservationAlert = () => {
    setDeleteObservationAlert({
      open: true,
      title: `¿Está seguro que desea eliminar la observación?`,
      description:
        'Al aceptar se validará el pago de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeValidatePaymentAlert = () => {
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const closeDeleteObservationAlert = () => {
    setDeleteObservationAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const fetchPayment = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/${id}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Cannot get payment');
    } else {
      setPayment(response.data.data);
    }
  };

  const validatePayment = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/validate/${id}`,
      token: authSession.user?.token,
      method: 'POST'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'Cannot validate payment');
    } else {
      handleOpenSnackbar('success', 'Validado');
      fetchPayment();
    }
  };

  const handleSubmitObservation = async (dataForm) => {
    console.log('DATA: ', dataForm);
    const dataToSend = { ...dataForm, idPayment: payment?.id };
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/observation`,
      method: 'POST',
      token: authSession.user?.token,
      data: dataToSend
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear la observación!');
    } else {
      handleOpenSnackbar('success', 'Observación creada exitosamente!');
      handleOpenCommentDialog(false);
      await fetchPayment();
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const openModalFile = (urlFile) => {
    setModalFile({ open: true, url: urlFile });
  };

  const closeModalFile = () => setModalFile({ open: false, url: '' });

  const deleteObservation = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/observation/${payment.observations[0].id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo elimnar la observación!');
    } else {
      await fetchPayment();
      handleOpenSnackbar('success', 'Observación eliminada exitosamente!');
    }
  };

  return (
    <>
      <Box>
        <Button
          component={RouterLink}
          to="../"
          color="inherit"
          sx={{ opacity: 0.7, my: 1 }}
          aria-label="Example">
          <ArrowBack /> regresar
        </Button>

        <Card sx={{ p: 3 }}>
          <Typography variant="h4">Detalles de pago</Typography>

          {payment && (
            <Box sx={{ my: 3 }}>
              <Grid container spacing={2} rowSpacing={5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Código comprobante</Typography>
                  <Typography variant="body1">{payment?.code || '-'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Cantidad</Typography>
                  <Typography variant="body1">${payment?.amount || '-'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Fecha de pago</Typography>
                  <Typography variant="body1">
                    {new Date(payment?.paymentDate).toLocaleDateString('es-ES') ?? ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Mes pagado</Typography>
                  <Typography variant="body1">
                    {new Date(payment?.datePaid).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'numeric'
                    }) ?? ''}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Estado</Typography>

                  {payment.validated ? (
                    <Chip size="small" label="Validado" color="primary" />
                  ) : (
                    <Chip size="small" label="No validado" color="error" />
                  )}

                  {/* <Typography variant="body1">{payment?.validated ? 'SI' : 'NO'}</Typography> */}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Propiedad</Typography>
                  <Typography variant="body1">{payment?.property?.tagName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Propietario</Typography>
                  <Typography variant="body1">
                    {`${payment?.owner?.firstName ?? ''} ${payment?.owner?.lastName ?? ''}` || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Inquilino</Typography>
                  <Typography variant="body1">
                    {`${payment?.tenant?.firstName ?? ''} ${payment?.tenant?.lastName ?? ''}` ||
                      '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      rowGap: '10px',
                      columnGap: '10px'
                    }}>
                    <Button
                      // fullWidth
                      sx={{ my: 1 }}
                      variant="contained"
                      onClick={() => openModalFile(payment?.paymentFile.url)}>
                      ver comprobante
                    </Button>

                    {authSession.user?.roles.includes('Arrendador') && !payment.validated && (
                      <Button
                        // fullWidth
                        color="secondary"
                        sx={{ my: 1 }}
                        variant="contained"
                        onClick={openValidatePaymentAlert}
                        // onClick={() => validatePayment()}
                      >
                        Validar pago
                      </Button>
                    )}

                    {authSession.user?.roles.includes('Arrendador') &&
                      !payment.validated &&
                      payment?.observations.length === 0 && (
                        <Button
                          // fullWidth
                          color="inherit"
                          sx={{ my: 1 }}
                          variant="contained"
                          onClick={() => handleOpenCommentDialog(true)}>
                          Agregar observación
                        </Button>
                      )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>

        {payment?.observations.length > 0 && (
          <Card sx={{ p: 3, my: 1 }}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                  {payment?.owner?.firstName?.split(' ')[0].charAt(0)}
                </Avatar>
              }
              title={`${payment?.owner?.firstName?.split(' ')[0]} ${
                payment?.owner?.lastName.split(' ')[0]
              }`}
              subheader={new Date(payment.observations[0].date).toLocaleString('es-ES')}
              action={
                authSession.user?.roles.includes('Arrendador') && (
                  <IconButton aria-label="delete" onClick={() => openDeleteObservationAlert(true)}>
                    <Clear color="error" />
                  </IconButton>
                )
              }
            />
            <CardContent>
              <Box sx={{ maxWidth: '100vw', overflow: 'hidden' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {payment.observations[0].description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={openCommentDialog} onClose={() => handleOpenCommentDialog(false)} fullWidth>
        <Box component="form" onSubmit={handleSubmit(handleSubmitObservation)}>
          <DialogTitle>Observación</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <TextField
                {...register('description', {
                  required: { value: true, message: 'Comentario requerido' },
                  maxLength: {
                    value: 200,
                    message: 'Longitud máxima de caracteres: 200'
                  }
                })}
                placeholder="Agregar observación..."
                multiline
                maxRows={20}
                minRows={7}
              />
              <FormHelperText error>{formState.errors.description?.message}</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleOpenCommentDialog(false)}>Cancelar</Button>
            <Button type="submit">Enviar</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {modalFile.open && (
        <ModalIframe opened={modalFile.open} url={modalFile.url} onCloseModal={closeModalFile} />
      )}

      <Alert
        state={alert}
        closeAlert={closeValidatePaymentAlert}
        onConfirm={() => validatePayment()}
      />

      <Alert
        state={deleteObservationAlert}
        closeAlert={closeDeleteObservationAlert}
        onConfirm={() => deleteObservation()}
      />
    </>
  );
};
