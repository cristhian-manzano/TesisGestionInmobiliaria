import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';

const tenant = {
  idCard: '0705291433',
  firstName: 'Cristhian Steven',
  lastName: 'Manzano Manzano',
  phone: '0968176747',
  dateOfBirth: '2020-01-01'
};

export const Details = () => {
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
              <Typography variant="body1">{tenant.idCard || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Teléfono</Typography>
              <Typography variant="body1">{tenant.phone || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Nombres</Typography>
              <Typography variant="body1">{tenant.firstName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Apellidos</Typography>
              <Typography variant="body1">{tenant.lastName || '-'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Fecha de nacimiento</Typography>
              <Typography variant="body1">{tenant.dateOfBirth || '-'}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
