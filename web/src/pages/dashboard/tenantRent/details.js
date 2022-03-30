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

  const [tenantRent, setTenantRent] = useState(null);

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

      {tenantRent && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h4">Detalles de renta / propietario</Typography>
          <Box sx={{ my: 3 }}>
            <Grid container spacing={2} rowSpacing={5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Cédula</Typography>
                <Typography variant="body1">{tenantRent?.owner?.idCard || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Correo</Typography>
                <Typography variant="body1">{tenantRent?.owner?.email || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Nombres</Typography>
                <Typography variant="body1">{tenantRent?.owner?.firstName || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Apellidos</Typography>
                <Typography variant="body1">{tenantRent?.owner?.lastName || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Teléfono</Typography>
                <Typography variant="body1">{tenantRent?.owner?.phone || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Fecha de inicio de alquiler</Typography>
                <Typography variant="body1">
                  {new Date(tenantRent?.startDate).toLocaleDateString('es-ES') ?? ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Propiedad</Typography>
                <Typography variant="body1">{tenantRent?.property?.tagName || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Dirección</Typography>
                <Typography variant="body1">{tenantRent.property?.address || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Día mensual de pago</Typography>
                <Typography variant="body1">{tenantRent?.paymentDay || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Valor mensual</Typography>
                <Typography variant="body1">${tenantRent.property?.price || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Garantía pagada</Typography>
                <Typography variant="body1">
                  {(tenantRent?.securityDeposit && `$${tenantRent?.securityDeposit}`) || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>
      )}
    </Box>
  );
};
