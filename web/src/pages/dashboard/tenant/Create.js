import { useState, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
  Autocomplete
} from '@mui/material';

import { ArrowBack, Search, Close, CalendarToday } from '@mui/icons-material';
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
    control,
    formState: { errors }
  } = useForm();

  const fetchProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/get-by-owner`,
      method: 'POST',
      token: `${authSession.user?.token}`
    });
    handleLoading(false);

    if (!response.error) {
      setProperties(
        response.data?.data.map((property) => ({ id: property.id, name: property.tagName }))
      );
    } else {
      handleOpenSnackbar('error', 'Cannot get properties!');
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

    if (!Number.isNaN(+searchTenant.inputSearch))
      searchParams.append('idCard', `${searchTenant.inputSearch}`);

    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(searchTenant.inputSearch))
      searchParams.append('email', `${searchTenant.inputSearch}`);

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_USER_SERVICE_URL}/user/tenant?${searchParams.toString()}`,
      method: 'GET'
    });
    handleLoading(false);

    if (!response.error) {
      handleOpenSnackbar('success', 'User get it');
      setSearchTenant((previous) => ({
        ...previous,
        tenant: response.data.data,
        obtained: true
      }));
    } else {
      handleOpenSnackbar('error', 'Cannot find user!');
    }
  };

  const onCancelSearch = () => {
    setSearchTenant({
      inputSearch: '',
      obtained: false,
      tenant: null
    });
  };

  const handleSubmitForm = (data) => console.log(data);

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
                      renderInput={(params) => <TextField {...params} label="Inmueble" />}
                    />
                  )}
                />
                <FormHelperText error>
                  {errors.propertyType && 'propertyType is required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  disabled={!searchTenant.obtained}
                  label="Depósito de garantía"
                  {...register('securityDeposit', { required: true })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
                <FormHelperText error>
                  {errors.securityDeposit && 'securityDeposit is required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="startDate"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        disabled={!searchTenant.obtained}
                        {...field}
                        label="Inicio de alquiler"
                        value={field.value ?? null}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>{errors.startDate && 'startDate is required'}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  disabled={!searchTenant.obtained}
                  label="Día de pago mensual"
                  {...register('paymentDate', { required: true })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday />
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText error>
                  {errors.paymentDate && 'paymentDate is required'}
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
