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
  Button
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material/';

const dataRentSelect = [
  { id: 1, name: 'Casa norte - Cristhian Manzano', additionalFields: [''] },
  { id: 2, name: 'Edificio central - Erick Luna', additionalFields: [''] }
];

export const Create = () => {
  const [rentSelect, setRentSelect] = useState('');

  const onChangeRentSelect = (e) => setRentSelect(e.target.value);

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
          <Typography variant="h4" sx={{ my: 2 }}>
            Datos de observación
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="rent-select">Alquileres</InputLabel>
                    <Select
                      labelId="rent-select"
                      id="demo-simple-select"
                      label="Alquileres"
                      onChange={onChangeRentSelect}
                      value={rentSelect}>
                      <MenuItem value={0} disabled>
                        Seleccionar
                      </MenuItem>

                      {dataRentSelect.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
