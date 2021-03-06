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

import { Search, Visibility, Edit, Delete, ExitToApp } from '@mui/icons-material';
import { Alert } from '../../../components/Alert';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Tenant = () => {
  const navigate = useNavigate();
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });
  const [tenantsRent, setTenantsRent] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');

  // Finish alert
  const [finishAlert, setFinishAlert] = useState({ open: false, title: '', description: '' });

  const onView = (id) => navigate(`${id}`);
  const onUpdate = (id) => navigate(`update/${id}`);

  const openDeleteAlert = (tenantRent) => {
    setSelectedTenant(tenantRent);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar el registro del inquilino '${tenantRent?.tenant?.firstName} ${tenantRent?.tenant?.lastName}'?`,
      description:
        'Al aceptar se eliminará el inquilino de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const openFinishAlert = (tenantRent) => {
    setSelectedTenant(tenantRent);

    setFinishAlert({
      open: true,
      title: `¿Está seguro que desea finalizar el alquiler con el inquilino '${tenantRent?.tenant?.firstName} ${tenantRent?.tenant?.lastName}'?`,
      description:
        'Al aceptar se finalizará el alquiler con el inquilino de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const fetchTenantsRent = async () => {
    const url = new URL(
      `${process.env.REACT_APP_RENT_SERVICE_URL}/rent?page=${page}&size=${rowsPerPage}`
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
      handleOpenSnackbar('error', 'Hubo un error al obtener los inquilinos');
    } else {
      setTenantsRent(response.data.data);
    }
  };

  useEffect(() => fetchTenantsRent(), [page, rowsPerPage]);

  const closeDeleteAlert = () => {
    setSelectedTenant(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const closeFinishAlert = () => {
    setSelectedTenant(null);
    setFinishAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const onDelete = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/${selectedTenant?.id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo elimnar el inquilino!');
    } else {
      await fetchTenantsRent();
      handleOpenSnackbar('success', 'Inquilino eliminado exitosamente!');
    }
  };

  const onFinishRent = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent/finish/${selectedTenant?.id}`,
      token: authSession.user?.token,
      method: 'PUT'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'Error!');
    } else {
      await fetchTenantsRent();
      handleOpenSnackbar('success', 'Alquiler finalizado!');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeSearchInput = (e) => setSearchInput(e.target.value);

  const onSearch = () => fetchTenantsRent();

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h4">Inquilinos (arrendatarios)</Typography>
          <Button component={RouterLink} to="create" variant="contained">
            Agregar
          </Button>
        </Box>
        <Card sx={{ p: 3 }}>
          <Box sx={{ py: 2 }}>
            <TextField
              placeholder="Inmueble o inquilino"
              onChange={onChangeSearchInput}
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
                  <TableCell>Inmueble</TableCell>
                  <TableCell>Fecha de inicio</TableCell>
                  <TableCell>Inquilino (arrendatario)</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantsRent.results?.length > 0 ? (
                  tenantsRent.results?.map((rent) => (
                    <TableRow
                      hover
                      key={rent?.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{rent?.property?.tagName}</TableCell>
                      <TableCell>{new Date(rent.startDate).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        {rent?.tenant?.firstName ?? ''} {rent?.tenant?.lastName ?? ''}
                      </TableCell>
                      <TableCell>{rent?.tenant?.email}</TableCell>
                      <TableCell>{rent?.tenant?.phone}</TableCell>
                      <TableCell>
                        {rent?.endDate === null ? (
                          <Chip size="small" label="Activo" color="primary" />
                        ) : (
                          <Chip size="small" label="Inactivo" color="error" />
                        )}
                      </TableCell>

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

                          {rent?.endDate === null && (
                            <MenuItem onClick={() => onUpdate(rent.id)}>
                              <ListItemIcon>
                                <Edit sx={{ fontSize: 25 }} />
                              </ListItemIcon>
                              <ListItemText
                                primary="Editar"
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </MenuItem>
                          )}

                          {rent?.endDate === null && (
                            <MenuItem onClick={() => openFinishAlert(rent)}>
                              <ListItemIcon>
                                <ExitToApp sx={{ fontSize: 25 }} />
                              </ListItemIcon>
                              <ListItemText
                                primary="Finalizar"
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </MenuItem>
                          )}

                          <MenuItem onClick={() => openDeleteAlert(rent)}>
                            <ListItemIcon>
                              <Delete sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Eliminar"
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
                    <TableCell colSpan={7}>
                      <Box
                        sx={{
                          p: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <Typography variant="h5" sx={{ opacity: 0.5 }}>
                          No se encontraron inquilinos.
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
            count={tenantsRent.pagination?.totalItems ?? 0}
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
      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />
      <Alert state={finishAlert} closeAlert={closeFinishAlert} onConfirm={() => onFinishRent()} />
    </>
  );
};
