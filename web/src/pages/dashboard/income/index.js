import { useState, useEffect, useContext } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { es } from 'date-fns/locale';

import {
  Box,
  Typography,
  Card,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Autocomplete,
  FormControl,
  Grid,
  TextField,
  Button
} from '@mui/material';

import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto'; // This is necessary for chart visualization
import { Search } from '@mui/icons-material';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { AuthContext } from '../../../store/context/authContext';
import { sendRequest } from '../../../helpers/utils';

export const Income = () => {
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [properties, setProperties] = useState([]);

  const [chartIncomeByYear, setChartIncomeByYear] = useState({
    data: [],
    totalIncome: null
  });

  // Filters
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [chartSelectedYear, setChartSelectedYear] = useState(null);

  const fetchProperties = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/get-by-owner`,
      method: 'GET',
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

  useEffect(() => {
    fetchProperties();
  }, []);

  const onFetchPayments = async () => {
    const url = new URL(
      `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/income?page=${page}&size=${rowsPerPage}`
    );

    if (selectedProperty && selectedProperty.id) {
      url.searchParams.append('idProperty', selectedProperty?.id);
    }

    if (selectedMonth) {
      const dateSelected = new Date(selectedMonth);
      url.searchParams.append('month', dateSelected.getMonth() + 1);
      url.searchParams.append('year', dateSelected.getFullYear());
    }

    handleLoading(true);
    const response = await sendRequest({
      urlPath: url,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener los pagos');
    } else {
      setPayments(response.data.data);
    }
  };

  useEffect(() => {
    onFetchPayments();
  }, [page, rowsPerPage]);

  const fetchIncomeByYear = async () => {
    // Get data
    const dateSelected = new Date(chartSelectedYear);

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${
        process.env.REACT_APP_RENT_SERVICE_URL
      }/payment/income?year=${dateSelected.getFullYear()}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error');
    } else {
      const { results } = response.data?.data ?? [];

      console.log('RESULTS: ', results);
      console.log('RESULTS: ', response.data?.data);

      const dataFinal = results.reduce((previous, current) => {
        const monthPaid = new Date(current.datePaid).getMonth();
        const temp = previous;
        temp[monthPaid] += +current.amount;
        return temp;
      }, new Array(12).fill(0));

      setChartIncomeByYear({ data: dataFinal, totalIncome: response.data?.data?.totalIncome });
    }
  };

  useEffect(() => {
    fetchIncomeByYear();
  }, [chartSelectedYear]);

  const onChangeProperty = (event, newValue) => {
    setSelectedProperty(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeChartIncome = async (newValue) => {
    setChartSelectedYear(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <Typography variant="h4">Ingresos</Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  value={selectedProperty}
                  onChange={onChangeProperty}
                  options={properties}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, valueSelected) => option.id === valueSelected.id}
                  renderInput={(params) => <TextField {...params} label="Inmueble" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <DatePicker
                    disableFuture
                    label="Mes"
                    views={['year', 'month']}
                    value={selectedMonth}
                    onChange={(newValue) => {
                      setSelectedMonth(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button fullWidth size="large" variant="contained" onClick={onFetchPayments}>
                <Search />
              </Button>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#e9e9e9' }}>
              <TableRow>
                <TableCell>Departamento</TableCell>
                <TableCell>Inquilino</TableCell>
                <TableCell>Fecha de pago</TableCell>
                <TableCell>Mes pagado</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.results?.length > 0 ? (
                payments.results?.map((payment) => (
                  <TableRow
                    hover
                    key={payment.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{payment.property?.tagName ?? ''}</TableCell>

                    <TableCell>{`${payment.tenant?.firstName ?? ''} ${
                      payment.tenant?.lastName ?? ''
                    }`}</TableCell>

                    <TableCell>
                      {new Date(payment?.paymentDate).toLocaleDateString('es-ES') ?? ''}
                    </TableCell>
                    <TableCell>
                      {new Date(payment?.datePaid).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'numeric'
                      }) ?? ''}
                    </TableCell>
                    <TableCell>$ {payment.amount ?? '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                // Valida - que no salga esto si esta cargando...
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      sx={{
                        p: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Typography variant="h5" sx={{ opacity: 0.5 }}>
                        No se encontraron pagos
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={payments.pagination?.totalItems ?? 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[5, 10, 20]}
        />

        {payments?.totalIncome !== null && (
          <Typography variant="h6" sx={{ textAlign: 'right', m: 3 }}>
            Total: ${payments?.totalIncome}
          </Typography>
        )}
      </Card>

      <Card sx={{ my: 3, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="h4">Por año</Typography>

          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
              <DatePicker
                disableFuture
                label="Año"
                views={['year']}
                value={chartSelectedYear}
                onChange={onChangeChartIncome}
                renderInput={(params) => <TextField {...params} disabled />}
              />
            </LocalizationProvider>
          </FormControl>
        </Box>

        <Box sx={{ height: 400 }}>
          <Bar
            height={115}
            data={{
              labels: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abri',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'
              ],
              datasets: [
                {
                  label: 'Ingresos ($)',
                  data: chartIncomeByYear.data,
                  backgroundColor: ['#f3ba2f', 'rgba(75, 192, 192, 1)', '#2a71d0', '#50AF95']
                }
              ]
            }}
          />

          {chartIncomeByYear.totalIncome !== null && (
            <Typography variant="h6" sx={{ textAlign: 'right', m: 3 }}>
              Total: ${chartIncomeByYear.totalIncome}
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};
