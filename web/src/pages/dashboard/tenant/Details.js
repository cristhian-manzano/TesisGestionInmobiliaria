import { useState, useEffect, useContext } from 'react';

import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';
import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Details = () => {
  const { id } = useParams();

  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [tenantRent, setTenantRent] = useState({});

  const fetchTenantRent = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/${id}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener el inquilino');
    } else {
      setTenantRent(response.data.data);
    }
  };

  useEffect(() => fetchTenantRent(), [id]);

  return (
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
        <Typography variant="h4">Detalles de inquilino</Typography>
        <Box sx={{ my: 3 }}>
          <Grid container spacing={2} rowSpacing={5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Cédula</Typography>
              <Typography variant="body1">{tenantRent?.tenant?.idCard || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Correo</Typography>
              <Typography variant="body1">{tenantRent?.tenant?.email || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Nombres</Typography>
              <Typography variant="body1">{tenantRent?.tenant?.firstName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Apellidos</Typography>
              <Typography variant="body1">{tenantRent?.tenant?.lastName || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Teléfono</Typography>
              <Typography variant="body1">{tenantRent?.tenant?.phone || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Fecha de inicio de alquiler</Typography>
              <Typography variant="body1">{tenantRent?.startDate || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Propiedad</Typography>
              <Typography variant="body1">{tenantRent?.property?.tagName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Día mensual de pago</Typography>
              <Typography variant="body1">{tenantRent?.paymentDay || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Garantía recibida</Typography>
              <Typography variant="body1">
                {(tenantRent?.securityDeposit && `$${tenantRent?.securityDeposit}`) || '-'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
