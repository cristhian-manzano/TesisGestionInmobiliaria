import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

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
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';

import { Search } from '@mui/icons-material';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';

export const PendingPayment = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Context
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const fetchPayments = async () => {
    const condition = searchInput ? `&search=${searchInput}` : '';

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment/pending?page=${page}&size=${rowsPerPage}${condition}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener los pagos pendientes');
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

  return (
    <Box>
      <Typography variant="h4">Pagos pendientes</Typography>

      <Card sx={{ p: 3 }}>
        <Box sx={{ py: 2 }}>
          <TextField
            placeholder="search"
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
                <TableCell>Fecha pendiente</TableCell>
                <TableCell>Día de pago</TableCell>
                <TableCell>Pendiente</TableCell>
                <TableCell>Departamento</TableCell>
                {authSession.user?.roles.includes('Arrendador') && <TableCell>Inquilino</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.results?.length > 0 ? (
                payments.results?.map((payment) => (
                  <TableRow
                    hover
                    key={payment.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      {' '}
                      {new Date(payment?.pendingDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'numeric'
                      }) ?? ''}
                    </TableCell>

                    <TableCell> {payment.rent?.paymentDay ?? '-'}</TableCell>

                    <TableCell>$ {payment.property?.price ?? '-'}</TableCell>

                    <TableCell>{payment.property?.tagName ?? ''}</TableCell>

                    {authSession.user?.roles.includes('Arrendador') && (
                      <TableCell>{`${payment.tenant?.firstName ?? ''} ${
                        payment.tenant?.lastName ?? ''
                      }`}</TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                // Valida - que no salga esto si esta cargando...
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
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Card>
    </Box>
  );
};
