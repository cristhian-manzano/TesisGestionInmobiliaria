import { useState, useEffect, useContext } from 'react';

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

import { Search, Delete, Visibility } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { Alert } from '../../../components/Alert';
import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Observation = () => {
  const navigate = useNavigate();
  const onView = (id) => navigate(`${id}`);

  const [observations, setObservations] = useState([]);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchObservations = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/observation`,
      method: 'GET',
      token: `${authSession?.user?.token}`
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'Cannot get observations');
      return;
    }
    setObservations(response.data?.data);
  };

  useEffect(() => {
    fetchObservations();
  }, []);

  const openDeleteAlert = (observation) => {
    setSelectedObservation(observation);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar la observación '${observation?.id}'?`,
      description:
        'Al aceptar se eliminará la observación de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeDeleteAlert = () => {
    setSelectedObservation(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const onDelete = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/observation/${selectedObservation?.id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo elimnar la observación!');
    } else {
      await fetchObservations();
      handleOpenSnackbar('success', 'Observación eliminado exitosamente!');
    }
  };

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
          <Typography variant="h4">Observaciones</Typography>
          <Button component={RouterLink} to="create" variant="contained">
            Agregar
          </Button>
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
                  <TableCell>Observación</TableCell>
                  <TableCell>Solucionado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Propiedad</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {observations.length > 0 ? (
                  observations.map((observation) => (
                    <TableRow
                      hover
                      key={observation.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography noWrap sx={{ width: 300 }}>
                          {observation.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{observation.solved ? 'Si' : 'No'}</TableCell>
                      <TableCell>{new Date(observation.date).toLocaleString()}</TableCell>
                      <TableCell>
                        {authSession.user?.email === observation.user?.email
                          ? 'Yo'
                          : `${observation.user?.firstName ?? ''} ${
                              observation.user?.lastName ?? ''
                            }`}
                      </TableCell>
                      <TableCell>{observation.property?.tagName}</TableCell>
                      <TableCell>
                        <TableMoreMenu>
                          <MenuItem onClick={() => onView(observation.id)}>
                            <ListItemIcon>
                              <Visibility sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Ver mas"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          {authSession.user?.email === observation.user?.email && (
                            <MenuItem onClick={() => openDeleteAlert(observation)}>
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
                    <TableCell colSpan={5}>
                      <Box
                        sx={{
                          p: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <Typography variant="h5" sx={{ opacity: 0.5 }}>
                          Aún no se han registrado observaciones.
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
      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />
    </>
  );
};
