import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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
  Chip
} from '@mui/material';

import { Search, Visibility } from '@mui/icons-material';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { sendRequest } from '../../../helpers/utils';

export const Payment = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Context
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const onView = (id) => navigate(`${id}`);

  const fetchPayments = async () => {
    const condition = searchInput ? `&search=${searchInput}` : '';

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/payment?page=${page}&size=${rowsPerPage}${condition}`,
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h4">Pagos</Typography>

        {authSession.user?.roles.includes('Arrendatario') && (
          <Button component={RouterLink} to="create" variant="contained">
            Agregar
          </Button>
        )}
      </Box>
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
                <TableCell>Código de comprobrante</TableCell>
                <TableCell>Fecha de pago</TableCell>
                <TableCell>Mes pagado</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Departamento</TableCell>

                {authSession.user?.roles.includes('Arrendador') && <TableCell>Inquilino</TableCell>}

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
                        <Chip size="small" label="No validado" color="error" />
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

                        {/* <MenuItem onClick={() => onUpdate(payment?.id ?? '')}>
                            <ListItemIcon>
                              <Edit sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Editar"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          <MenuItem onClick={() => openDeleteAlert(payment)}>
                            <ListItemIcon>
                              <Delete sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Eliminar"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem> */}
                      </TableMoreMenu>
                    </TableCell>
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
