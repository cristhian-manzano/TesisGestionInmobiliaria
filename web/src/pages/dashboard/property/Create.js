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
} from '@mui/material';

import { AddCircleOutline, Delete } from '@mui/icons-material/';

const dataPropertyType = [
  { id: 1, name: 'Casa', additionalFields: [''] },
  { id: 2, name: 'Departamento', additionalFields: [''] },
  { id: 3, name: 'Local', additionalFields: [''] },
  { id: 4, name: 'Edificio', additionalFields: [''] },
  { id: 5, name: 'Terreno', additionalFields: [''] }
];

export const Create = () => {
  const [propertyType, setPropertyType] = useState('');
  const onChangePropertyType = (e) => setPropertyType(e.target.value);

  return (
    <Box>
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
                  <Button variant="text">
                    <AddCircleOutline />
                    Agregar
                  </Button>
                </Box>

                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                  alignItems="center"
                  sx={{ overflow: 'auto' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      position: 'relative'
                    }}>
                    <img
                      src="https://image.shutterstock.com/image-illustration/beautiful-aurora-universe-milky-way-600w-1787056478.jpg"
                      alt="Imagen"
                      height={150}
                      width={150}
                    />

                    <IconButton sx={{ position: 'absolute', top: 5, right: 5, p: 0 }}>
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      position: 'relative'
                    }}>
                    <img
                      src="https://image.shutterstock.com/image-illustration/beautiful-aurora-universe-milky-way-600w-1787056478.jpg"
                      alt="Imagen"
                      height={150}
                      width={150}
                    />

                    <IconButton sx={{ position: 'absolute', top: 5, right: 5, p: 0 }}>
                      <Delete color="error" />
                    </IconButton>
                  </Box>
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
