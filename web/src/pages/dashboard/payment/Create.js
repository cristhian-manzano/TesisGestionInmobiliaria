import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { es } from 'date-fns/locale';

import moment from 'moment';

import {
  Box,
  Grid,
  TextField,
  Card,
  Typography,
  FormControl,
  Button,
  FormHelperText,
  InputAdornment,
  IconButton,
  Link,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack, Add, Delete } from '@mui/icons-material/';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { AuthContext } from '../../../store/context/authContext';
import { sendRequest } from '../../../helpers/utils';

export const Create = () => {
  const [paymentFile, setPaymentFile] = useState(null);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [tenantsRent, setTenantsRent] = useState([]);

  // const [minDatePaid, setMinDatePaid] = useState(null);
  const [selectedRent, setSelectedRent] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const fetchRents = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/tenant`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Cannot get rents');
    } else {
      const data = response.data?.data.filter((d) => d.endDate === null) ?? [];

      // setTenantsRent(response.data.data);
      setTenantsRent(data);
    }
  };

  useEffect(() => {
    fetchRents();
  }, []);

  const onSubmit = async (dataForm) => {
    if (!paymentFile) return handleOpenSnackbar('error', 'Archivo requerido!');

    const dataToSend = {
      ...dataForm,
      ...(paymentFile && { paymentFile: paymentFile.file })
    };

    const formData = new FormData();
    Object.keys(dataToSend).forEach((key) => formData.append(key, dataToSend[key]));
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment`,
      method: 'POST',
      token: authSession.user?.token,
      data: formData,
      isFormData: true
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', response.message ?? 'No se pudo crear el pago!');
    } else {
      handleOpenSnackbar('success', 'pago creado exitosamente!');
      reset();
      setPaymentFile(null);
    }

    return null;
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (parseFloat(file.size / 1024 ** 2) > 5) return;

    setPaymentFile({
      id: `${file.name}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file
    });
  };

  const onDeletPaymentFile = () => {
    setPaymentFile(null);
  };

  const onChangeRent = ({ target }) => {
    const rent = tenantsRent.find((r) => r.id === target.value);

    if (rent) {
      // setValue('amount', rent.property?.price);
      // if (rent.startDate) setMinDatePaid(new Date(rent.startDate));
      setSelectedRent(rent);
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
            Crear pago
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="rent-select">Alquileres</InputLabel>
                <Controller
                  name="idRent"
                  control={control}
                  rules={{ required: { value: true, message: 'Alquiler requerido.' } }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      labelId="rent-select"
                      label="Alquileres"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChangeRent(e);
                      }}>
                      <MenuItem value={0} disabled>
                        Seleccionar
                      </MenuItem>

                      {tenantsRent?.map((rent) => (
                        <MenuItem key={rent.id} value={rent.id}>
                          {`${rent.property?.tagName ?? ''} - ${rent.property?.address ?? ''}`}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText error>{errors?.idRent?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <Controller
                    name="datePaid"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        // disableFuture
                        disabled={!selectedRent}
                        label="Mes a pagar"
                        views={['year', 'month']}
                        openTo="month"
                        value={field.value}
                        onChange={field.onChange}
                        minDate={selectedRent?.startDate ? new Date(selectedRent.startDate) : null}
                        maxDate={new Date(moment().add(12, 'M').calendar())}
                        renderInput={(params) => <TextField {...params} />}
                        // minDate={minDatePaid ? new Date(minDatePaid) : null}
                        // maxDate={new Date('2023-06-01')}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormHelperText error>
                  {errors.datePaid?.type === 'required' && 'Mes de pago requerido'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  disabled={!selectedRent}
                  label="Código de comprobante"
                  {...register('code', {
                    required: { value: true, message: 'Código de comprobante requerido' },
                    maxLength: { value: 25, message: 'Longitud máxima de caracteres: 25' },
                    pattern: {
                      value: /^[A-Za-z0-9]*$/,
                      message: 'Caracteres especiales o espacios no son permitidos.'
                    }
                  })}
                />
                <FormHelperText error>{errors.code?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  // disabled
                  disabled={!selectedRent}
                  label="Cantidad"
                  {...register('amount', {
                    required: { value: true, message: 'Precio requerido' },
                    pattern: {
                      value: /^\d+\.?\d{0,2}$/,
                      message: 'Solo se aceptan números enteros o con 2 decimales.'
                    },
                    min: {
                      value: 1,
                      message: 'Solo puede ingresar montos mayores o iguales a $1.'
                    },
                    max: {
                      value: selectedRent?.property?.price,
                      message: `El valor máximo del alquiler es $${selectedRent?.property?.price}.`
                    }
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
                <FormHelperText error>{errors.amount?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <Controller
                    name="paymentDate"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        disableFuture
                        disabled={!selectedRent}
                        label="Fecha de pago"
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={field.value}
                        minDate={selectedRent?.startDate ? new Date(selectedRent.startDate) : null}
                        onChange={field.onChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormHelperText error>
                  {errors.paymentDate?.type === 'required' && 'Fecha de pago requerida'}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Box sx={{ p: 2, border: '1px solid #DDDDDD' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    my: 1
                  }}>
                  <Typography variant="h5">Comprobante (requerido)</Typography>

                  <label htmlFor="btn-upload">
                    <input
                      type="file"
                      id="btn-upload"
                      style={{ display: 'none' }}
                      accept=".jpg, .jpeg, .png, .pdf"
                      onChange={uploadFile}
                    />
                    <Button variant="outlined" component="span">
                      <Add />
                      {/* Agregar */}
                    </Button>
                  </label>
                </Box>

                {paymentFile && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1
                    }}>
                    <Link href={paymentFile?.url} target="_blank" rel="noopener">
                      {paymentFile?.file.name}
                    </Link>
                    <IconButton color="error" aria-label="delete" onClick={onDeletPaymentFile}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <FormHelperText>
                Formatos permitidos: .jpg, .jpeg, .png, .pdf - Tamaño máximo de archivo permitido:
                5MB
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
