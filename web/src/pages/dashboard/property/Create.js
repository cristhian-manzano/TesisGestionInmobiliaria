import { useEffect, useState, useContext } from 'react';

import {
  Box,
  Grid,
  TextField,
  Card,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Autocomplete
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material/';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { ImagesUpload } from '../../../components/ImagesUpload';
// Utils
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  // Contexts
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  // States
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState({ loaded: [], uploaded: [], deleted: [] });

  // Types properties
  const [properties, setProperties] = useState([]);
  const [sectors, setSectors] = useState([]);

  const fetchProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/type-property`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo obtener los Tipo propiedades!');
    } else {
      setProperties(response.data?.data || []);
    }
  };

  const fetchSectors = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/sector`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo obtener los sectores!');
    } else {
      setSectors(response.data?.data || []);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchSectors();
  }, []);

  const onChangePropertyType = (e) => setPropertyType(e.target.value);

  const handleChangeImages = (newState) => {
    setImages(newState);
  };

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
      <Box component="form">
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Datos de inmueble
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="property-select">Tipo inmueble</InputLabel>
                    <Select
                      labelId="property-select"
                      id="propertyTypeId"
                      label="Tipo inmueble"
                      onChange={onChangePropertyType}
                      value={propertyType}>
                      <MenuItem value={0} disabled>
                        Seleccionar
                      </MenuItem>

                      {properties.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Area" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  id="sectorsAutocomplete"
                  options={sectors}
                  isOptionEqualToValue={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label="Sector" />}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Precio" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Dirección" />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Descripción"
                placeholder="Agregar descripción de inmueble..."
                multiline
                maxRows={20}
                minRows={5}
                inputProps={{ maxLength: 2000 }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <ImagesUpload images={images} onChangeImages={handleChangeImages} />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button fullWidth variant="contained">
                Crear
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
