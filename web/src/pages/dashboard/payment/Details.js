import { useState, useEffect } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid, Link as MuiLink } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';

const paymentData = {
  code: 2334,
  amount: 200,
  paymentDate: '2020-01-01',
  datePaid: '2020-01-01',
  filePayment:
    'https://s3-ap-southeast-2.amazonaws.com/wc-prod-pim/JPEG_1000x1000/KEFLATFIL6_keji_flat_file_a4_assorted_colours_6_pack.jpg'
};

export const Details = () => {
  const [payment, setPayment] = useState({});

  useEffect(() => setPayment(paymentData), []);

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
              <Typography variant="subtitle1">Código comprobante</Typography>
              <Typography variant="body1">{payment?.code || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Cantidad</Typography>
              <Typography variant="body1">{payment?.amount || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Fecha de pago</Typography>
              <Typography variant="body1">{payment?.paymentDate || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Fecha pagada</Typography>
              <Typography variant="body1">{payment?.datePaid || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Comprobante</Typography>
              <MuiLink href={payment?.filePayment} target="_blank" rel="noopener">
                <Typography variant="body1">{payment?.filePayment || '-'}</Typography>
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
