import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

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
  FormHelperText,
  InputAdornment
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material/';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { ImagesUpload } from '../../../components/ImagesUpload';
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  // Contexts
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [images, setImages] = useState({ loaded: [], uploaded: [], deleted: [] });
  // Selected type property
  const [selectedTypeProperty, setSelectedTypeProperty] = useState({});
  const [sectors, setSectors] = useState([]);
  const [typeProperties, setTypeProperties] = useState([]);

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
    fetchSectors();
    fetchTypeProperties();
  }, []);

  const handleSelectTypeProperty = (e) => {
    const getTypeProperty = typeProperties.find((type) => type.id === e.target.value);
    setSelectedTypeProperty(getTypeProperty);
  };

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleChangeImages = (newState) => setImages(newState);

  const onSubmit = async (data) => {
    const keysForm = [
      'tagName',
      'description',
      'area',
      'price',
      'address',
      'idTypeProperty',
      'idSector'
    ];

    const fields = Object.keys(data).reduce((obj, key) => {
      if (keysForm.includes(key)) return { ...obj, [key]: data[key] };

      if (selectedTypeProperty?.additionalFeatures?.includes(key))
        return { ...obj, additionalFeatures: { ...obj.additionalFeatures, [key]: data[key] } };

      return obj;
    }, {});

    const dataToSend = {
      ...fields,
      idSector: fields.idSector?.id,
      additionalFeatures: JSON.stringify(fields.additionalFeatures ?? {})
    };

    const formData = new FormData();
    Object.keys(dataToSend).forEach((key) => formData.append(key, dataToSend[key]));

    // Adding images to formdata
    images.uploaded
      .map((image) => image.file)
      .forEach((image) => {
        formData.append('propertyImages', image);
      });

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property`,
      method: 'POST',
      token: authSession.user?.token,
      data: formData,
      isFormData: true
    });
    handleLoading(false);

    if (response.error) {
      console.log('RESPONSE: ', response);
      handleOpenSnackbar('error', response.message ?? 'No se pudo crear la propiedad!');
    } else {
      handleOpenSnackbar('success', 'Propiedad creada exitosamente!');
      reset();
      setImages({ loaded: [], uploaded: [], deleted: [] });
    }
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
            Crear inmueble
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
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          labelId="property-select"
                          label="Tipo inmueble"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            field.onChange(e);
                            handleSelectTypeProperty(e);
                          }}>
                          {typeProperties.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    <FormHelperText error>
                      {errors.idTypeProperty && 'Debe seleccionar tipo de inmueble'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nombre"
                  {...register('tagName', {
                    required: { value: true, message: 'Nombre requerido' },
                    maxLength: {
                      value: 50,
                      message: 'M??xima longitud de caracteres: 50'
                    }
                  })}
                />
                <FormHelperText error>{errors.tagName?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Area m2"
                  {...register('area', {
                    required: { value: true, message: 'Area requerida' },
                    pattern: {
                      value: /^\d+\.?\d{0,2}?$/,
                      message: 'Solo se aceptan n??meros enteros o con 2 decimales.'
                    },
                    min: { value: 0, message: 'Ingrese n??meros positivos.' },
                    max: { value: 100000000, message: 'Longitud demasiado elevada.' }
                  })}
                />
                <FormHelperText error>{errors.area?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="idSector"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      id="sectorsAutocomplete"
                      options={sectors}
                      isOptionEqualToValue={(option) =>
                        sectors?.find((sector) => sector.id === option?.id)
                      }
                      onChange={(e, newValue) => field.onChange(newValue)}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label="Sector" />}
                    />
                  )}
                />

                <FormHelperText error>
                  {errors.idSector && 'Debe seleccionar el sector'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Precio mensual"
                  {...register('price', {
                    required: { value: true, message: 'Precio mensual requerido' },
                    pattern: {
                      value: /^\d+\.?\d{0,2}?$/,
                      message: 'Solo se aceptan n??meros enteros o con 2 decimales.'
                    },
                    min: { value: 0, message: 'Ingrese n??meros positivos.' },
                    max: { value: 100000000, message: 'Longitud demasiado elevada.' }
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
                <FormHelperText error>{errors.price?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Direcci??n"
                  {...register('address', {
                    required: { value: true, message: 'Direcci??n requerida' },
                    maxLength: {
                      value: 100,
                      message: 'M??xima longitud de caracteres: 100'
                    }
                  })}
                />
                <FormHelperText error>{errors.address?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* ----------------------- start Adittional features ----------------------- */}
            {selectedTypeProperty?.additionalFeatures?.includes('bedRooms') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Habitaciones"
                    {...register('bedRooms', {
                      required: { value: true, message: 'N??mero de habitaciones requerido.' },
                      pattern: {
                        value: /^[1-9]\d*(\d+)?$/i,
                        message: 'Solo se aceptan n??meros enteros.'
                      }
                    })}
                  />
                  <FormHelperText error>{errors.bedRooms?.message}</FormHelperText>
                </FormControl>
              </Grid>
            )}

            {selectedTypeProperty?.additionalFeatures?.includes('bathRooms') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Ba??os"
                    {...register('bathRooms', {
                      required: { value: true, message: 'N??mero de ba??os requerido.' },
                      pattern: {
                        value: /^[1-9]\d*(\d+)?$/i,
                        message: 'Solo se aceptan n??meros enteros.'
                      }
                    })}
                  />
                  <FormHelperText error>{errors.bathRooms?.message}</FormHelperText>
                </FormControl>
              </Grid>
            )}
            {/* ----------------------- end Adittional features ----------------------- */}

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <TextField
                  label="Descripci??n"
                  {...register('description', {
                    required: { value: true, message: 'Descripci??n requerida' },
                    maxLength: { value: 255, message: 'M??xima cantidad de caracteres: 255' }
                  })}
                  placeholder="Agregar descripci??n de inmueble..."
                  multiline
                  maxRows={20}
                  minRows={5}
                  inputProps={{ maxLength: 2000 }}
                />
                <FormHelperText error>{errors.description?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <ImagesUpload images={images} onChangeImages={handleChangeImages} />
              <FormHelperText>
                Formato: .jpg, .jpeg, .png - Tama??o m??ximo de imagenes permitido: 5MB
              </FormHelperText>
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
