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
  ListItemText
} from '@mui/material';

import { Search, Visibility } from '@mui/icons-material';
import { Alert } from '../../../components/Alert';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const TenantRent = () => {
  const navigate = useNavigate();
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [tenantsRent, setTenantsRent] = useState([]);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onView = (id) => navigate(`${id}`);

  const fetchTenantsRent = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/tenant`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener los inquilinos');
    } else {
      setTenantsRent(response.data.data);
    }
  };

  useEffect(() => fetchTenantsRent(), []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h4">Alquileres</Typography>
      </Box>
      <Card>
        <Box sx={{ py: 2 }}>
          <TextField
            placeholder="search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
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
                <TableCell>Inmueble</TableCell>
                <TableCell>Día de pago</TableCell>
                <TableCell>Nombre (Propietario)</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {tenantsRent.length > 0 ? (
                tenantsRent.map((rent) => (
                  <TableRow
                    hover
                    key={rent?.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{rent?.property?.tagName}</TableCell>
                    <TableCell>{rent.paymentDay}</TableCell>
                    <TableCell>{`${rent.owner?.firstName ?? ''} ${
                      rent.owner?.lastName ?? ''
                    }`}</TableCell>
                    <TableCell>{rent?.owner?.email}</TableCell>
                    <TableCell>{rent?.owner?.phone}</TableCell>

                    <TableCell>
                      <TableMoreMenu>
                        <MenuItem onClick={() => onView(rent.id)}>
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
                        Aún no ha registrado inquilinos.
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
