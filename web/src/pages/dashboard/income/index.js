import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
  Button
} from '@mui/material';

import { Search, Visibility } from '@mui/icons-material';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { sendRequest } from '../../../helpers/utils';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Income = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Test
  const [value, setValue] = useState(null);

  const [age, setAge] = useState('');

  // Context
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const onView = (id) => navigate(`${id}`);

  const fetchPayments = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment`,
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
    fetchPayments();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Test
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h4">Ingresos</Typography>
      </Box>
      <Card>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Propiedad</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Propiedad"
                  onChange={handleChange}>
                  <MenuItem value={10}>Casa norte</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <DatePicker
                    disableFuture
                    label="Mes"
                    views={['year', 'month']}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button fullWidth size="large" variant="contained">
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
                <TableCell>Fecha de pago</TableCell>
                <TableCell>Mes pagado</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow
                    hover
                    key={payment.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{payment.property?.tagName ?? ''}</TableCell>
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

                    <TableCell>
                      <TableMoreMenu>
                        <MenuItem onClick={() => onView(payment.id)}>
                          <ListItemIcon>
                            <Visibility sx={{ fontSize: 25 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Ver mas"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </MenuItem>
                      </TableMoreMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Valida - que no salga esto si esta cargando...
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box
                      sx={{
                        p: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Typography variant="h5" sx={{ opacity: 0.5 }}>
                        Aún no hay pagos registrados
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
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};
