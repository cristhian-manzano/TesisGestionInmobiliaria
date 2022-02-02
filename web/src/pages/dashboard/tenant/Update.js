import { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

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
  Autocomplete
} from '@mui/material';

import { ArrowBack, CalendarToday } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { AuthContext } from '../../../store/context/authContext';
import { sendRequest } from '../../../helpers/utils';

export const Update = () => {
  const { id } = useParams();
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [properties, setProperties] = useState([]);
  const [updatetenantRent, setUpdateTenantRent] = useState({});

  const { register, handleSubmit, control, reset, formState } = useForm();

  const fetchTenantRent = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/${id}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener el inquilino');
    } else {
      setUpdateTenantRent(response.data.data);
    }
  };

  useEffect(() => fetchTenantRent(), [id]);

  useEffect(() => {
    if (Object.keys(updatetenantRent).length > 0) {
      reset({
        propertyType: { id: updatetenantRent.property.id, name: updatetenantRent.property.tagName },
        securityDeposit: updatetenantRent?.securityDeposit ?? '',
        startDate: updatetenantRent?.startDate ?? '',
        paymentDay: updatetenantRent?.paymentDay ?? ''
      });
    }
  }, [updatetenantRent]);

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

  const handleSubmitForm = async (data) => {
    const updatedField = {};

    Object.keys(formState.dirtyFields).forEach((key) => {
      updatedField[key] = data[key];
    });

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/${id}`,
      method: 'PUT',
      token: authSession.user?.token,
      data: updatedField
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear!');
    } else {
      handleOpenSnackbar('success', 'Actualizado exitosamente!');
      fetchTenantRent();
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
            Actualizar inquilino
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nombre"
                  value={`${updatetenantRent?.tenant?.firstName ?? ''} ${
                    updatetenantRent?.tenant?.lastName ?? ''
                  }`}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField label="Cédula" value={updatetenantRent?.tenant?.idCard ?? ''} disabled />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Teléfono"
                  value={updatetenantRent?.tenant?.phone ?? ''}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField label="Email" value={updatetenantRent?.tenant?.email ?? ''} disabled />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  control={control}
                  name="propertyType"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      disabled
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
                  {formState.errors.propertyType && 'propertyType is required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Depósito de garantía"
                  {...register('securityDeposit', { required: true })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
                <FormHelperText error>
                  {formState.errors.securityDeposit && 'securityDeposit is required'}
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
                        {...field}
                        label="Inicio de alquiler"
                        value={field.value ?? null}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>
                  {formState.errors.startDate && 'startDate is required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Día de pago mensual"
                  {...register('paymentDay', { required: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday />
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText error>
                  {formState.errors.paymentDay && 'paymentDay is required'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button disabled={!formState.isDirty} type="submit" fullWidth variant="contained">
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
