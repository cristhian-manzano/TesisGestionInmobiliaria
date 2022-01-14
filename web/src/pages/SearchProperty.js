import React from 'react';

import {
  Box,
  Grid,
  Card,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CardMedia,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Link } from 'react-router-dom';

import { WhatsApp, Search, FilterAlt, CompareArrows } from '@mui/icons-material/';

import LogoImage from '../assets/img/logo.png';

const dataProperties = [
  {
    id: 1,
    name: 'Casa norte',
    description: `Ubicado en Villas del Bosque, Km 20 Vía a la Costa, 4to retorno. Amoblado completamente. Cuenta con 3 dormitorios, sala-comedor amplios, cocina independiente, 1 cuarto de servicio, lavandería, 2 parqueos y ascensor. Está en el 2do piso. *el valor no incluye alicuota`,
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80',
    price: 200,
    sector: 'Alborada Este',
    address: 'Calle 2, vía 1, Manzana #2',
    area: '23',
    additionalDetails: {
      bedrooms: 2,
      bathrooms: 1
    },
    owner: {
      phone: '0968176747'
    }
  },
  {
    id: 2,
    name: 'Casa norte',
    description: `Ubicado en Villas del Bosque, Km 20 Vía a la Costa, 4to retorno. Amoblado completamente. Cuenta con 3 dormitorios, sala-comedor amplios, cocina independiente, 1 cuarto de servicio, lavandería, 2 parqueos y ascensor. Está en el 2do piso. *el valor no incluye alicuota`,
    image:
      'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1031&q=80',
    price: 500,
    sector: 'Alborada Este',
    address: 'Calle 2, vía 1, Manzana #2',
    area: '23',
    additionalDetails: {
      bedrooms: 2,
      bathrooms: 1
    },
    owner: {
      phone: '0968176747'
    }
  },
  {
    id: 3,
    name: 'Casa norte',
    description: `Ubicado en Villas del Bosque, Km 20 Vía a la Costa, 4to retorno. Amoblado completamente. Cuenta con 3 dormitorios, sala-comedor amplios, cocina independiente, 1 cuarto de servicio, lavandería, 2 parqueos y ascensor. Está en el 2do piso. *el valor no incluye alicuota`,
    image:
      'https://images.unsplash.com/photo-1503174971373-b1f69850bded?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=913&q=80',
    price: 400,
    sector: 'Alborada Este',
    address: 'Calle 2, vía 1, Manzana #2',
    area: '23',
    additionalDetails: {
      bedrooms: 2,
      bathrooms: 1
    },
    owner: {
      phone: '0968176747'
    }
  },
  {
    id: 4,
    name: 'Casa norte',
    description: `Ubicado en Villas del Bosque, Km 20 Vía a la Costa, 4to retorno. Amoblado completamente. Cuenta con 3 dormitorios, sala-comedor amplios, cocina independiente, 1 cuarto de servicio, lavandería, 2 parqueos y ascensor. Está en el 2do piso. *el valor no incluye alicuota`,
    image:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80',
    price: 300,
    sector: 'Alborada Este',
    address: 'Calle 2, vía 1, Manzana #2',
    area: '23',
    additionalDetails: {
      bedrooms: 2,
      bathrooms: 1
    },
    owner: {
      phone: '0968176747'
    }
  },
  {
    id: 5,
    name: 'Casa norte',
    description: `Ubicado en Villas del Bosque, Km 20 Vía a la Costa, 4to retorno. Amoblado completamente. Cuenta con 3 dormitorios, sala-comedor amplios, cocina independiente, 1 cuarto de servicio, lavandería, 2 parqueos y ascensor. Está en el 2do piso. *el valor no incluye alicuota`,
    image:
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80',
    price: 200,
    sector: 'Alborada Este',
    address: 'Calle 2, vía 1, Manzana #2',
    area: '23',
    additionalDetails: {
      bedrooms: 2,
      bathrooms: 1
    },
    owner: {
      phone: '0968176747'
    }
  }
];

export const SearchProperty = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Box sx={{ mr: 2 }}>
            <img src={LogoImage} alt="logo" height={35} width={35} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Proyecto inmobiliario
          </Typography>

          <Box>
            <Button component={Link} to="/" variant="text" color="secondary" sx={{ my: 1, mx: 1 }}>
              Inicio
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              variant="text"
              color="secondary"
              sx={{ my: 1, mx: 1 }}>
              Dashboard
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="text"
              color="secondary"
              sx={{ my: 1, mx: 1 }}>
              Iniciar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 4, flex: '1 1 auto' }}>
        <Box
          sx={{
            mt: 2,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Grid container sx={{ my: 2, maxWidth: '700px' }} rowSpacing={1} spacing={1}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={1}
                  label="Age"
                  // onChange={handleChange}
                >
                  <MenuItem value={1}>Casa</MenuItem>
                  <MenuItem value={2}>Departamento</MenuItem>
                  <MenuItem value={3}>Local comercial</MenuItem>
                  <MenuItem value={4}>Edificio</MenuItem>
                  <MenuItem value={5}>Terreno</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField fullWidth placeholder="Ingresar sector a buscar" id="fullWidth" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" sx={{ py: 2 }}>
                <Search />
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              Resultados encontrados {dataProperties.length}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button>
                <CompareArrows sx={{ transform: 'rotate(90deg)' }} />
                Ordenar
              </Button>
              <Button>
                <FilterAlt />
                Filtrar
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={2}>
            {dataProperties.map((property) => (
              <Grid key={property.id} xs={12} sm={6} md={4} lg={3} item>
                <Card>
                  <CardMedia
                    component="img"
                    height="150"
                    image={property.image}
                    alt="Paella dish"
                  />
                  <Box sx={{ p: 3 }}>
                    <Stack spacing={1}>
                      <Typography variant="h5">{`$${property.price}`}</Typography>
                      <Typography
                        sx={{
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2
                        }}
                        variant="subtitle2">
                        {property.description}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
                        {`${property.sector} - ${property.address}`}
                      </Typography>
                      <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={1}>
                        <Typography variant="subtitle1">{`${property.area} m2`}</Typography>
                        <Typography variant="subtitle1">2 Hab.</Typography>
                        <Typography variant="subtitle1">1 bañ.</Typography>
                      </Stack>

                      <Button
                        href={`https://wa.me/${property.owner.phone}?text=Hola`}
                        target="_blank"
                        rel="noopener"
                        fullWidth
                        variant="outlined">
                        <WhatsApp />
                        Contactar
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
