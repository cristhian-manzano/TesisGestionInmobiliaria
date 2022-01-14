import { useState } from 'react';

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
  Stack,
  Divider,
  IconButton
  // InputAdornment
} from '@mui/material';

import { AddCircleOutline, Delete, ArrowBack } from '@mui/icons-material/';

import { Link as RouterLink } from 'react-router-dom';

const dataPropertyType = [
  { id: 1, name: 'Casa', additionalFields: [''] },
  { id: 2, name: 'Departamento', additionalFields: [''] },
  { id: 3, name: 'Local', additionalFields: [''] },
  { id: 4, name: 'Edificio', additionalFields: [''] },
  { id: 5, name: 'Terreno', additionalFields: [''] }
];

export const Create = () => {
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState({ loaded: [], uploaded: [], deleted: [] });

  const onChangePropertyType = (e) => setPropertyType(e.target.value);

  const uploadImage = (e) => {
    const uploadedImages = images.uploaded;

    [...e.target.files]?.forEach((image, index) => {
      // Condición para solo subir archivos < 5 MB
      if (parseFloat(image.size / 1024 ** 2) > 5) return;

      // Condición para no subir si se sobrepasa el limite establecido (8 por ahora)
      if (e.target.files.length - index + images.loaded.length + images.uploaded.length > 8) return;

      uploadedImages.push({
        id: `${image.name}-${Date.now()}`,
        url: URL.createObjectURL(image),
        file: image
      });
    });

    // Clean input component
    e.target.value = null;
    setImages((previous) => ({ ...previous, uploaded: uploadedImages }));
  };

  const onDeleteImage = (id) => {
    const imagesDeleted = images.deleted;

    const loadedFiltered = images.loaded.filter((image) => {
      if (image.id !== id) return true;
      imagesDeleted.push(image);
      return false;
    });
    const uploadedFiltered = images.uploaded.filter((image) => image.id !== id);
    setImages({ loaded: loadedFiltered, uploaded: uploadedFiltered, deleted: imagesDeleted });
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
                      id="demo-simple-select"
                      label="Tipo inmueble"
                      onChange={onChangePropertyType}
                      value={propertyType}>
                      <MenuItem value={0} disabled>
                        Seleccionar
                      </MenuItem>

                      {dataPropertyType.map((type) => (
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
              <TextField fullWidth label="Precio" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Dirección" />
            </Grid>

            {/* Caracteristicas */}

            {/* <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Habitaciones" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Baños" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alicuota"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid> */}

            {/* CASA Y EDIFICIO */}
            {/* <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Pisos" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Departamentos" />
            </Grid> */}

            {/* luz(SI-NO), agua(SI-NO), estacionamiento-parqueo(SI-NO), Amoblado(SI-NO) */}
            {/* Caracteristicas */}

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
              <Box sx={{ p: 2, border: '1px solid #DDDDDD' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    my: 1
                  }}>
                  <Typography variant="h5">Imágenes</Typography>

                  <label htmlFor="btn-upload">
                    <input
                      type="file"
                      id="btn-upload"
                      style={{ display: 'none' }}
                      multiple
                      accept=".jpg, .jpeg, .png"
                      onChange={uploadImage}
                    />
                    <Button variant="outlined" component="span">
                      <AddCircleOutline />
                      Agregar
                    </Button>
                  </label>
                </Box>

                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                  alignItems="center"
                  sx={{ overflow: 'auto' }}>
                  {[...images.loaded, ...images.uploaded].map((image) => (
                    <Box
                      key={image?.id}
                      sx={{
                        display: 'flex',
                        position: 'relative'
                      }}>
                      <a href={image?.url} target="_blank" rel="noreferrer">
                        <img src={image?.url} alt="Imagen" height={150} width={150} />
                      </a>

                      <IconButton
                        sx={{ position: 'absolute', top: 5, right: 5, p: 0 }}
                        onClick={() => onDeleteImage(image?.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
            {/* FIN PRUEBA */}

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
