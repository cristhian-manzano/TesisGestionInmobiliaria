import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { Box, Typography, Card, Button, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';
// Remember user
// import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';

export const Details = () => {
  const [property, setProperty] = useState({});
  const { id } = useParams();

  // Contexts - Remember user
  // const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const fetchProperty = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/${id}`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo obtener los Tipo propiedades!');
    } else {
      setProperty(response.data?.data || {});
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

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
        <Typography variant="h4">Detalles de propiedad</Typography>
        <Box sx={{ my: 3 }}>
          <Grid container spacing={2} rowSpacing={5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Etiqueta</Typography>
              <Typography variant="body1">{property.tagName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Tipo inmueble</Typography>
              <Typography variant="body1">{property.typeProperty?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Dirección</Typography>
              <Typography variant="body1">{property.address || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Sector</Typography>
              <Typography variant="body1">{property.sector?.name || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">area</Typography>
              <Typography variant="body1">{property.area || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Precio</Typography>
              <Typography variant="body1">{property.price || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Disponible</Typography>
              <Typography variant="body1">{property.available || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="subtitle1">Descripción</Typography>
              <Typography variant="body1">{property.description || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5">Imagenes </Typography>

              <Box
                sx={{ my: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {property.ImagesProperties?.map((image) => (
                  <Box key={image.id} sx={{ m: 1 }}>
                    <img alt="Imagen propiedad" src={image.url} height={125} />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
