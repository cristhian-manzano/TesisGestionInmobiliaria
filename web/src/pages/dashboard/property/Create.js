import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
  Autocomplete,
  FormHelperText
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material/';

import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { ImagesUpload } from '../../../components/ImagesUpload';
import { propertyScheme } from '../../../schemas/property';
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [images, setImages] = useState({ loaded: [], uploaded: [], deleted: [] });
  const [properties, setProperties] = useState([]);
  const [sectors, setSectors] = useState([]);

  const {
    // reset,
    // getValues,
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(propertyScheme),
    defaultValues: {}
  });

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

  const handleChangeImages = (newState) => {
    setImages(newState);
  };

  // Put data as variable
  const onSubmit = () => {
    // Send data
    // const sendData = {
    //   ...data,
    //   idSector: data.sector[0]?.id,
    //   additionalFeatures: {},
    //   propertyImages: images.uploaded
    // };
    // FormData send
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
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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

                    <Controller
                      name="idTypeProperty"
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="property-select"
                          // id="propertyTypeId"
                          label="Tipo inmueble"
                          value={field.value ?? ''}
                          onChange={field.onChange}>
                          {properties.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    <FormHelperText error>{errors.idTypeProperty?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" {...register('tagName')} />
              <FormHelperText error>{errors.tagName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Area" {...register('area')} />
              <FormHelperText error>{errors.area?.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      id="sectorsAutocomplete"
                      options={sectors}
                      onChange={(e, newValue) => field.onChange(newValue)}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label="Sector" />}
                    />
                  )}
                />

                <FormHelperText error>{errors.sector?.id.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Precio" {...register('price')} />
              <FormHelperText error>{errors.price?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Dirección" {...register('address')} />
              <FormHelperText error>{errors.address?.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Descripción"
                {...register('description')}
                placeholder="Agregar descripción de inmueble..."
                multiline
                maxRows={20}
                minRows={5}
                inputProps={{ maxLength: 2000 }}
              />
              <FormHelperText error>{errors.description?.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} sm={12}>
              <ImagesUpload images={images} onChangeImages={handleChangeImages} />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button type="submit" fullWidth variant="contained">
                Crear
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
