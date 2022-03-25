import { useEffect, useState, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
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

import { ArrowBack } from '@mui/icons-material';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { ImagesUpload } from '../../../components/ImagesUpload';
import { sendRequest } from '../../../helpers/utils';

export const Update = () => {
  const { id } = useParams();

  // Contexts
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [images, setImages] = useState({ loaded: [], uploaded: [], deleted: [] });
  const [selectedTypeProperty, setSelectedTypeProperty] = useState({});
  const [sectors, setSectors] = useState([]);
  const [typeProperties, setTypeProperties] = useState([]);
  const [updateProperty, setUpdateProperty] = useState(null);

  const { reset, control, register, handleSubmit, formState } = useForm();

  // Fetch property
  const fetchProperty = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/${id}`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo obtener la propiedad!');
    } else {
      setUpdateProperty(response.data?.data);
    }
  };

  useEffect(() => fetchProperty(), []);

  const fetchTypeProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/type-property`,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Error al obtener tipos de propiedades.');
    } else {
      setTypeProperties(response.data?.data || []);
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
      handleOpenSnackbar('error', 'Error al obtener sectores.');
    } else {
      setSectors(response.data?.data || []);
    }
  };

  useEffect(() => {
    fetchSectors();
    fetchTypeProperties();
  }, []);

  useEffect(() => {
    // reset form with user data
    if (updateProperty) {
      reset({
        idTypeProperty: updateProperty.typeProperty.id,
        tagName: updateProperty.tagName,
        area: updateProperty.area,
        price: updateProperty.price,
        address: updateProperty.address,
        description: updateProperty.description,
        idSector: updateProperty.sector,
        ...updateProperty.additionalFeatures
      });

      setSelectedTypeProperty(
        typeProperties.find((type) => type.id === updateProperty.typeProperty.id)
      );
      setImages((previous) => ({ ...previous, loaded: updateProperty.ImagesProperties }));
    }
  }, [updateProperty]);

  const handleSelectTypeProperty = (e) => {
    const getTypeProperty = typeProperties.find((type) => type.id === e.target.value);
    setSelectedTypeProperty(getTypeProperty);
  };

  const handleChangeImages = (newState) => setImages(newState);

  const onSubmit = async (data) => {
    // Get changed values
    const changedFields = Object.keys(formState.dirtyFields).reduce(
      (previous, newValue) => ({ ...previous, [newValue]: data[newValue] }),
      {}
    );

    const keysForm = ['tagName', 'description', 'area', 'price', 'address', 'idTypeProperty'];

    const fields = Object.keys(changedFields).reduce((previous, newValue) => {
      if (keysForm.includes(newValue)) return { ...previous, [newValue]: changedFields[newValue] };
      if (selectedTypeProperty?.additionalFeatures?.includes(newValue))
        return {
          ...previous,
          additionalFeatures: {
            ...previous.additionalFeatures,
            [newValue]: changedFields[newValue]
          }
        };
      return previous;
    }, {});

    const dataToSend = {
      ...fields,
      additionalFeatures: JSON.stringify(fields.additionalFeatures ?? {}),
      ...(images.deleted.length > 0 && { deletedImages: JSON.stringify(images.deleted) })
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
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/${updateProperty.id}`,
      method: 'PUT',
      token: authSession.user?.token,
      data: formData,
      isFormData: true
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo actualizar la propiedad!');
    } else {
      handleOpenSnackbar('success', 'Propiedad actualizada exitosamente!');
      setImages({ loaded: [], uploaded: [], deleted: [] });
      fetchProperty();
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
            Actualizar inmueble
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
                      {formState.errors.idTypeProperty && 'Debe seleccionar tipo de inmueble'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nombre"
                  {...register('tagName', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText error>
                  {formState.errors.tagName && 'Nombre requerido'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Area m2"
                  {...register('area', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText error>{formState.errors.area && 'Area requerida'}</FormHelperText>
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
                      disabled
                      disablePortal
                      value={field.value ?? null}
                      options={sectors}
                      isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                      }}
                      onChange={(e, newValue) => field.onChange(newValue)}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label="Sector" />}
                    />
                  )}
                />

                <FormHelperText error>
                  {formState.errors.idSector && 'Debe seleccionar el sector'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Precio mensual"
                  {...register('price', { required: true })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
                <FormHelperText error>
                  {formState.errors.price && 'Precio requerido'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Dirección"
                  {...register('address', { required: true })}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText error>
                  {formState.errors.address && 'Dirección requerida'}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* ----------------------- start Adittional features ----------------------- */}
            {selectedTypeProperty?.additionalFeatures?.includes('bedRooms') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Habitaciones"
                    {...register('bedRooms', { required: true })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormHelperText error>
                    {formState.errors.bedRooms && 'Habitaciones requeridas'}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}

            {selectedTypeProperty?.additionalFeatures?.includes('bathRooms') && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Baños"
                    {...register('bathRooms', { required: true })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormHelperText error>
                    {formState.errors.bathRooms && 'Baños requeridas'}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}
            {/* ----------------------- end Adittional features ----------------------- */}

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <TextField
                  label="Descripción"
                  {...register('description', { required: true })}
                  placeholder="Agregar descripción de inmueble..."
                  multiline
                  maxRows={20}
                  minRows={5}
                  inputProps={{ maxLength: 2000 }}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText error>
                  {formState.errors.description && 'Descripción requerida'}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <ImagesUpload images={images} onChangeImages={handleChangeImages} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  !formState.isDirty && images.uploaded.length === 0 && images.deleted.length === 0
                }>
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
