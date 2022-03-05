import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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

import { Search, Visibility, Edit, Delete } from '@mui/icons-material';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

// Alert
import { Alert } from '../../../components/Alert';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { sendRequest } from '../../../helpers/utils';

export const Property = () => {
  const navigate = useNavigate();
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchInput, setSearchInput] = useState('');

  const openDeleteAlert = (property) => {
    setSelectedProperty(property);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar la propiedad '${property.tagName}'?`,
      description:
        'Al aceptar se eliminará la propiedad de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeDeleteAlert = () => {
    setSelectedProperty(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const fetchProperties = async () => {
    const condition = searchInput ? `&search=${searchInput}` : '';

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/get-by-owner?page=${page}&size=${rowsPerPage}${condition}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Hubo un error al obtener propiedades');
    } else {
      setProperties(response.data.data);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, rowsPerPage]);

  const onView = (id) => navigate(`${id}`);
  const onUpdate = (id) => navigate(`update/${id}`);

  const onDelete = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/${selectedProperty?.id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo elimnar la propiedad!');
    } else {
      await fetchProperties();
      handleOpenSnackbar('success', 'Propiedad eliminada exitosamente!');
    }
  };

  const onChangeSearchInput = (e) => setSearchInput(e.target.value);

  const onSearch = () => fetchProperties();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h4">Inmuebles</Typography>
          <Button component={RouterLink} to="create" variant="contained">
            Agregar
          </Button>
        </Box>
        <Card sx={{ p: 3 }}>
          <Box sx={{ py: 2 }}>
            <TextField
              placeholder="search"
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo de inmueble</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.results?.length > 0 ? (
                  properties.results?.map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{row.tagName}</TableCell>
                      <TableCell>{row.typeProperty?.name}</TableCell>
                      <TableCell>
                        {row.available ? (
                          <Chip label="Disponible" size="small" color="success" />
                        ) : (
                          <Chip label="Ocupado" size="small" color="error" />
                        )}
                      </TableCell>
                      <TableCell>$ {row.price}</TableCell>

                      <TableCell>
                        <TableMoreMenu>
                          <MenuItem onClick={() => onView(row.id)}>
                            <ListItemIcon>
                              <Visibility sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Ver mas"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          <MenuItem onClick={() => onUpdate(row.id)}>
                            <ListItemIcon>
                              <Edit sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Editar"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          <MenuItem onClick={() => openDeleteAlert(row)}>
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
                    <TableCell colSpan={5}>
                      <Box
                        sx={{
                          p: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <Typography variant="h5" sx={{ opacity: 0.5 }}>
                          Aún no ha registrado propiedades.
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
            count={properties.pagination?.totalItems ?? 0}
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
    </>
  );
};
