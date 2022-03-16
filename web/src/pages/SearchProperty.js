import { useEffect, useState, useContext } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';

import {
  WhatsApp,
  Search
  // FilterAlt,
  // CompareArrows
} from '@mui/icons-material/';

import { LoadingContext } from '../store/context/LoadingGlobal';
import { SnackbarContext } from '../store/context/SnackbarGlobal';

import LogoImage from '../assets/img/logo.png';
import { sendRequest } from '../helpers/utils';

const settings = {
  infinite: true,
  dots: true,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  lazyLoad: true
};

export const SearchProperty = () => {
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [properties, setProperties] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [typeProperties, setTypeProperties] = useState([]);
  const [selectedTypeProperty, setSelectedTypeProperty] = useState(null);

  const fetchProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener propiedades');
    } else {
      setProperties(response.data.data);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchSectors = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/sector`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error');
    } else {
      setSectors(response.data?.data || []);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchTypeProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/type-property`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error');
    } else {
      setTypeProperties(response.data?.data || []);
    }
  };

  useEffect(() => {
    fetchTypeProperties();
  }, []);

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
        {/* <Box
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
                <InputLabel id="demo-simple-select-label">Tipo inmueble</InputLabel>

                <Select
                  labelId="property-select"
                  label="Tipo inmueble"
                  value={selectedTypeProperty ?? ''}
                  onChange={(e) => {
                    setSelectedTypeProperty(e.target.value);
                  }}>
                  {typeProperties.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={7}>
              <Autocomplete
                disablePortal
                id="sectorsAutocomplete"
                options={sectors}
                value={selectedSector}
                onChange={(e, newValue) => setSelectedSector(newValue)}
                isOptionEqualToValue={(option, valueSelected) => option.id === valueSelected.id}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Sector" />}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" sx={{ py: 2 }}>
                <Search />
              </Button>
            </Grid>
          </Grid>
        </Box> */}

        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              Propiedades disponibles {properties.length}
            </Typography>
            {/* <Stack direction="row" spacing={1}>
              <Button>
                <CompareArrows sx={{ transform: 'rotate(90deg)' }} />
                Ordenar
              </Button>
              <Button>
                <FilterAlt />
                Filtrar
              </Button>
            </Stack> */}
          </Box>

          <Grid container spacing={2}>
            {properties.map((property) => (
              <Grid key={property.id} xs={12} sm={6} md={4} lg={3} item>
                <Card>
                  <CardMedia>
                    {property.ImagesProperties && property.ImagesProperties.length > 0 ? (
                      <Slider {...settings}>
                        {property.ImagesProperties?.map((image) => (
                          <img
                            key={image.id}
                            height={160}
                            src={
                              image?.url ??
                              'http://mediawestrealty.com/wp-content/uploads/2017/06/no-property-photo-2.jpg'
                            }
                            alt=""
                          />
                        ))}
                      </Slider>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                          height={160}
                          src="http://mediawestrealty.com/wp-content/uploads/2017/06/no-property-photo-2.jpg"
                          alt=""
                        />
                      </Box>
                    )}
                  </CardMedia>

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
                        {`${property.sector?.name} - ${property?.address}`}
                      </Typography>
                      {/* <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={1}>
                        <Typography variant="subtitle1">{`${property.area} m2`}</Typography>
                        <Typography variant="subtitle1">2 Hab.</Typography>
                        <Typography variant="subtitle1">1 bañ.</Typography>
                      </Stack> */}

                      {/* <Button fullWidth size="small" color="secondary" variant="outlined">
                        Ver detalles
                      </Button> */}
                      <Button
                        href="https://wa.me/0968176747?text=Hola! estoy interesado en la propiedad."
                        target="_blank"
                        rel="noopener"
                        fullWidth
                        size="small"
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

        {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5 }}>
          <Pagination count={10} color="primary" size="small" />
        </Box> */}
      </Box>
    </Box>
  );
};
