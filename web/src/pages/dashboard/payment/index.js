import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

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
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  ButtonGroup
} from '@mui/material';

import { Search, Visibility, Delete } from '@mui/icons-material';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';
import { Alert } from '../../../components/Alert';
import { PendingPayment } from './PendingPayments';

export const Payment = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Context
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const onView = (id) => navigate(`${id}`);

  const fetchPayments = async () => {
    const url = new URL(
      `${process.env.REACT_APP_RENT_SERVICE_URL}/payment?page=${page}&size=${rowsPerPage}`
    );

    if (searchInput) {
      url.searchParams.append('search', searchInput.trim());
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
    fetchPayments();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeSearchInput = (e) => setSearchInput(e.target.value);

  const onSearch = () => fetchPayments();

  const openDeleteAlert = (payment) => {
    setSelectedPayment(payment);

    setAlert({
      open: true,
      title: `??Est?? seguro que desea eliminar el pago con c??digo de comprobante '${payment?.code}' ?`,
      description:
        'Al aceptar se eliminar?? el pago de manera permanente y no podr?? deshacer los cambios.'
    });
  };

  const closeDeleteAlert = () => {
    setSelectedPayment(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const onDelete = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/${selectedPayment?.id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });

    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', response.message ?? 'No se pudo eliminar el pago!');
    } else {
      await fetchPayments();
      handleOpenSnackbar('success', 'Pago eliminado exitosamente!');
    }
  };

  return (
    <>
      <Box sx={{ my: 3 }}>
        <ButtonGroup
          variant="outlined"
          sx={{ backgroundColor: 'white' }}
          aria-label="outlined button group">
          <Button
            variant={searchParams.get('show') !== 'pending' ? 'contained' : 'outlined'}
            component={RouterLink}
            to="/dashboard/payments">
            Pagos realizados
          </Button>
          <Button
            variant={searchParams.get('show') === 'pending' ? 'contained' : 'outlined'}
            component={RouterLink}
            to="/dashboard/payments?show=pending">
            Pagos pendientes
          </Button>
        </ButtonGroup>
      </Box>

      {searchParams.get('show') !== 'pending' && (
        <Box>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
              <Typography variant="h4">Pagos realizados</Typography>

              {authSession.user?.roles.includes('Arrendatario') && (
                <Button component={RouterLink} to="create" variant="contained">
                  Agregar
                </Button>
              )}
            </Box>
            <Divider />
            <Box sx={{ py: 2 }}>
              <TextField
                placeholder="C??digo, inquilino o departamento"
                onChange={onChangeSearchInput}
                value={searchInput}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onSearch}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: '#e9e9e9' }}>
                  <TableRow>
                    <TableCell>C??digo de comprobrante</TableCell>
                    <TableCell>Fecha de pago</TableCell>
                    <TableCell>Mes pagado</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Departamento</TableCell>
                    {authSession.user?.roles.includes('Arrendador') && (
                      <TableCell>Inquilino (arrendatario)</TableCell>
                    )}
                    <TableCell>Estado</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.results?.length > 0 ? (
                    payments.results?.map((payment) => (
                      <TableRow
                        hover
                        key={payment.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{payment.code ?? ''}</TableCell>
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
                        <TableCell>{payment.property?.tagName ?? ''}</TableCell>

                        {authSession.user?.roles.includes('Arrendador') && (
                          <TableCell>{`${payment.tenant?.firstName ?? ''} ${
                            payment.tenant?.lastName ?? ''
                          }`}</TableCell>
                        )}

                        <TableCell>
                          {payment.validated ? (
                            <Chip size="small" label="Validado" color="primary" />
                          ) : (
                            <Chip size="small" label="No validado" color="warning" />
                          )}
                        </TableCell>

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

                            {!payment.validated && (
                              <MenuItem onClick={() => openDeleteAlert(payment)}>
                                <ListItemIcon>
                                  <Delete sx={{ fontSize: 25 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Eliminar"
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </MenuItem>
                            )}
                          </TableMoreMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box
                          sx={{
                            p: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                          <Typography variant="h5" sx={{ opacity: 0.5 }}>
                            No se encontraron pagos.
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
              labelRowsPerPage="Filas por p??gina"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Card>
        </Box>
      )}
      {searchParams.get('show') === 'pending' && (
        <Box sx={{ mb: 6 }}>
          <PendingPayment />
        </Box>
      )}

      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />
    </>
  );
};
