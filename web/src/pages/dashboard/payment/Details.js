import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';
import { ModalIframe } from '../../../components/ModalIframe';

import { Alert } from '../../../components/Alert';

export const Details = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);

  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [alert, setAlert] = useState({ open: false, title: '', description: '' });

  const [modalFile, setModalFile] = useState({
    open: false,
    url: ''
  });

  const openValidatePaymentAlert = () => {
    setAlert({
      open: true,
      title: `¿Está seguro que desea validar el pago?`,
      description:
        'Al aceptar se validará el pago de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeValidatePaymenDeleteAlert = () => {
    setAlert((previous) => ({
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

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const openModalFile = (urlFile) => {
    setModalFile({ open: true, url: urlFile });
  };

  const closeModalFile = () => setModalFile({ open: false, url: '' });

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
                  <Button
                    fullWidth
                    sx={{ my: 1 }}
                    variant="contained"
                    onClick={() => openModalFile(payment?.paymentFile.url)}>
                    ver comprobante
                  </Button>

                  {authSession.user?.roles.includes('Arrendador') && !payment.validated && (
                    <Button
                      fullWidth
                      color="secondary"
                      sx={{ my: 1 }}
                      variant="contained"
                      onClick={openValidatePaymentAlert}
                      // onClick={() => validatePayment()}
                    >
                      Validar pago
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>
      </Box>

      {modalFile.open && (
        <ModalIframe opened={modalFile.open} url={modalFile.url} onCloseModal={closeModalFile} />
      )}

      <Alert
        state={alert}
        closeAlert={closeValidatePaymenDeleteAlert}
        onConfirm={() => validatePayment()}
      />
    </>
  );
};
