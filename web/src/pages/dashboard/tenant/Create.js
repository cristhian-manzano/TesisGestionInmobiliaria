import { useState, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import moment from 'moment';

import {
  Box,
  TextField,
  Card,
  Typography,
  Button,
  FormControl,
  Grid,
  FormHelperText,
  InputAdornment,
  IconButton,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { ArrowBack, Search, Close } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { AuthContext } from '../../../store/context/authContext';
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [searchTenant, setSearchTenant] = useState({
    inputSearch: '',
    obtained: false,
    tenant: null
  });

  const [properties, setProperties] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm();

  const fetchProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/get-by-owner`,
      method: 'GET',
      token: `${authSession.user?.token}`
    });
    handleLoading(false);

    if (!response.error) {
      const data = response.data.data?.filter((d) => d.available) ?? [];
      setProperties(data.map((property) => ({ id: property.id, name: property.tagName })));
    } else {
      handleOpenSnackbar('error', 'Error al obtener propiedades!');
    }
  };

  useEffect(() => fetchProperties(), []);

  const onChangeInputSearch = (e) =>
    setSearchTenant((previous) => ({
      ...previous,
      inputSearch: e.target.value
    }));

  const onSearchTenant = async () => {
    const searchParams = new URLSearchParams();
    const searchInput = searchTenant.inputSearch.trim(); // Remove spaces

    if (!Number.isNaN(+searchInput)) {
      searchParams.append('idCard', `${searchInput}`);
    }

    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(searchInput))
      searchParams.append('email', `${searchInput}`);

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/user/tenant?${searchParams.toString()}`,
      method: 'GET'
    });
    handleLoading(false);

    if (!response.error) {
      handleOpenSnackbar('success', 'usuario encontrado.');
      setSearchTenant((previous) => ({
        ...previous,
        tenant: response.data.data,
        obtained: true
      }));
    } else {
      handleOpenSnackbar('error', 'Usuario no encontrado!');
    }
  };

  const onCancelSearch = () => {
    setSearchTenant({
      inputSearch: '',
      obtained: false,
      tenant: null
    });
  };

  const handleSubmitForm = async (data) => {
    const { propertyType, ...dataSend } = data;

    const body = {
      ...dataSend,
      idTenant: searchTenant?.tenant?.id,
      idProperty: propertyType.id
    };

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent`,
      method: 'POST',
      token: authSession.user?.token,
      data: body
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear!');
    } else {
      handleOpenSnackbar('success', 'Creado exitosamente!');
      reset();
      onCancelSearch();
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
      <Box component="form" onSubmit={handleSubmit(handleSubmitForm)} noValidate>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Agregar inquilino
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      disabled={searchTenant.obtained}
                      label="Buscar por cédula o correo"
                      value={searchTenant.inputSearch}
                      onChange={onChangeInputSearch}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              edge="end"
                              onClick={searchTenant.obtained ? onCancelSearch : onSearchTenant}>
                              {searchTenant.obtained ? <Close /> : <Search />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {searchTenant.obtained && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="Nombre"
                      value={searchTenant.tenant?.firstName ?? ''}
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField label="Cédula" value={searchTenant.tenant?.idCard ?? ''} disabled />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField label="Teléfono" value={searchTenant.tenant?.phone ?? ''} disabled />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField label="Email" value={searchTenant.tenant?.email ?? ''} disabled />
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  control={control}
                  name="propertyType"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      disabled={!searchTenant.obtained}
                      disablePortal
                      value={field.value ?? null}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={properties}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, valueSelected) =>
                        option.id === valueSelected.id
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Inmuebles disponibles" />
                      )}
                    />
                  )}
                />
                <FormHelperText error>
                  {errors.propertyType && 'Tipo de propiedad es requerido.'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  placeholder="00.00"
                  disabled={!searchTenant.obtained}
                  label="Depósito de garantía"
                  {...register('securityDeposit', {
                    required: { value: true, message: 'Depósito de garantía es requerido.' },
                    min: { value: 0, message: 'Ingrese cantidades positivas.' },
                    max: { value: 10000000, message: 'Número demasiado elevado.' },
                    pattern: {
                      value: /^\d+\.?\d{0,2}?$/,
                      message: 'Solo se aceptan números enteros o con 2 decimales.'
                    }
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
                <FormHelperText error>{errors.securityDeposit?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="startDate"
                    rules={{
                      valueAsDate: true,

                      required: { value: true, message: 'Fecha de inicio válida es requerida.' },

                      max: {
                        value: new Date(),
                        message: `Fecha máxima: ${new Date().toLocaleDateString('es-EC')}`
                      },

                      min: {
                        value: new Date(moment().subtract(5, 'years').calendar()),
                        message: `Fecha mínima: ${new Date(
                          moment().subtract(5, 'years').calendar()
                        ).toLocaleDateString('es-EC')}`
                      }
                    }}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        disabled={!searchTenant.obtained}
                        {...field}
                        label="Inicio de alquiler"
                        value={field.value ?? null}
                        maxDate={new Date()}
                        minDate={new Date(moment().subtract(5, 'years').calendar())}
                        renderInput={(params) => <TextField {...params} />}
                        onError={(e) => setValue('startDate', null)}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>{errors.startDate?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  disabled={!searchTenant.obtained}
                  label="Día de pago mensual"
                  {...register('paymentDay', { required: true })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday />
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText error>
                  {errors.paymentDay && 'paymentDay is required'}
                </FormHelperText>
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="paymentDay-select">Día de pago mensual</InputLabel>
                <Controller
                  name="paymentDay"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      labelId="paymentDay-select"
                      disabled={!searchTenant.obtained}
                      label="Día de pago mensual"
                      {...field}>
                      <MenuItem value={0} disabled>
                        Seleccionar
                      </MenuItem>

                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                <FormHelperText error>
                  {errors.paymentDay && 'Día de pago requerido'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button type="submit" fullWidth variant="contained" disabled={!searchTenant.obtained}>
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
