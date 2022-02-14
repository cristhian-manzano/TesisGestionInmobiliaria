import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import {
  Box,
  Grid,
  TextField,
  Card,
  Typography,
  FormControl,
  Button,
  FormHelperText,
  IconButton,
  Link
} from '@mui/material';

import { ArrowBack, AddCircleOutline, Delete } from '@mui/icons-material/';

export const Create = () => {
  const [paymentFile, setPaymentFile] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {};

  const uploadFile = (e) => {
    const file = e.target.files[0];

    setPaymentFile({
      id: `${file.name}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file
    });
  };

  const onDeletPaymentFile = () => {
    setPaymentFile(null);
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
            Crear contrato
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de inicio"
                        value={field.value}
                        onChange={field.onChange}
                        maxDate={new Date()}
                        minDate={new Date(1900, 1, 1)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>
                <FormHelperText error>{errors.startDate?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <MobileDatePicker
                        label="Fecha de fin"
                        value={field.value}
                        onChange={field.onChange}
                        maxDate={new Date()}
                        minDate={new Date(1900, 1, 1)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormHelperText error>{errors.endDate?.message}</FormHelperText>
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
                  <Typography variant="h5">Contrato</Typography>

                  <label htmlFor="btn-upload">
                    <input
                      type="file"
                      id="btn-upload"
                      style={{ display: 'none' }}
                      accept=".jpg, .jpeg, .png, .pdf"
                      onChange={uploadFile}
                    />
                    <Button variant="outlined" component="span">
                      <AddCircleOutline />
                      Agregar
                    </Button>
                  </label>
                </Box>

                {paymentFile && (
                  <Box sx={{ display: 'flex', p: 1 }}>
                    <Link href={paymentFile?.url} target="_blank" rel="noopener">
                      {paymentFile?.file.name}
                    </Link>
                    <IconButton color="error" aria-label="delete" onClick={onDeletPaymentFile}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
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
