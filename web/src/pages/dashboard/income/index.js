import { useState } from 'react';
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
  Button,
  Divider
} from '@mui/material';

import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import { Search, Visibility } from '@mui/icons-material';
import { TableMoreMenu } from '../../../components/TableMoreMenu';

export const Income = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Test
  const [value, setValue] = useState(null);
  const [age, setAge] = useState('');

  const onView = (id) => navigate(`${id}`);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <Typography variant="h4">Ingresos</Typography>
      </Box>
      <Card sx={{ p: 3 }}>
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
                <TableCell>Inquilino</TableCell>
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
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Box>

        <Box>
          <Bar
            height={70}
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
                  data: [100, 200, 400],
                  backgroundColor: ['rgba(75, 192, 192, 1)', '#2a71d0', '#50AF95', '#f3ba2f']
                }
              ]
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};
