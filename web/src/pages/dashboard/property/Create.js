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
    <Box sx={{ p: 2 }}>
      <Box component="form">
        <Card sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Datos de inmueble
          </Typography>

          <Grid container spacing={2}>
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
