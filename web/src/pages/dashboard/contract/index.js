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

import { Search, Visibility, Delete, FileOpen } from '@mui/icons-material';
import { Alert } from '../../../components/Alert';
import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { AuthContext } from '../../../store/context/authContext';

import { ModalIframe } from '../../../components/ModalIframe';
import { sendRequest } from '../../../helpers/utils';

export const Contract = () => {
  const navigate = useNavigate();

  const [selectedContract, setSelectedContract] = useState(null);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { authSession } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');

  const [modalFile, setModalFile] = useState({
    open: false,
    url: ''
  });

  const onView = (id) => navigate(`${id}`);

  // Modal
  const openModalFile = (urlFile) => setModalFile({ open: true, url: urlFile });
  const closeModalFile = () => setModalFile({ open: false, url: '' });

  const fetchContracts = async () => {
    const url = new URL(
      `${process.env.REACT_APP_RENT_SERVICE_URL}/contracts?page=${page}&size=${rowsPerPage}`
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
      handleOpenSnackbar('error', 'Hubo un error al obtener propiedades');
    } else {
      setContracts(response.data.data);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [page, rowsPerPage]);

  const openDeleteAlert = (contract) => {
    setSelectedContract(contract);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar el contrato '${contract?.id}'?`,
      description:
        'Al aceptar se eliminará el contrato de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeDeleteAlert = () => {
    setSelectedContract(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const onDelete = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/contracts/${selectedContract?.id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo elimnar la propiedad!');
    } else {
      await fetchContracts();
      handleOpenSnackbar('success', 'Propiedad eliminada exitosamente!');
    }
  };

  const onChangeSearchInput = (e) => setSearchInput(e.target.value);
  const onSearch = () => fetchContracts();

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h4">Contratos</Typography>
          {authSession.user?.roles.includes('Arrendador') && (
            <Button component={RouterLink} to="create" variant="contained">
              Agregar
            </Button>
          )}
        </Box>
        <Card sx={{ p: 3 }}>
          <Box sx={{ py: 2 }}>
            <TextField
              placeholder="Propiedad o inquilino"
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
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha de inicio</TableCell>
                  <TableCell>Fecha de fin</TableCell>
                  {/* <TableCell>Archivo</TableCell> */}
                  <TableCell>Propiedad</TableCell>
                  <TableCell>Inquilino</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.results?.length > 0 ? (
                  contracts.results?.map((contract) => (
                    <TableRow
                      hover
                      key={contract.id ?? ''}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{contract.id ?? ''}</TableCell>
                      <TableCell>
                        {new Date(contract.startDate).toLocaleDateString('es-ES') ?? ''}
                      </TableCell>
                      <TableCell>
                        {new Date(contract.endDate).toLocaleDateString('es-ES') ?? ''}
                      </TableCell>
                      {/* <TableCell>{contract.contractFile.key ?? ''}</TableCell> */}
                      <TableCell>{contract.property?.tagName ?? ''}</TableCell>
                      <TableCell>
                        {`${contract.tenant?.firstName ?? ''} ${contract.tenant?.lastName ?? ''}`}
                      </TableCell>
                      <TableCell>
                        {contract.active ? (
                          <Chip label="Activo" size="small" color="success" />
                        ) : (
                          <Chip label="Inactivo" size="small" color="error" />
                        )}
                      </TableCell>

                      <TableCell>
                        <TableMoreMenu>
                          <MenuItem onClick={() => onView(contract.id)}>
                            <ListItemIcon>
                              <Visibility sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Ver mas"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          <MenuItem onClick={() => openModalFile(contract?.contractFile?.url)}>
                            <ListItemIcon>
                              <FileOpen sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Ver archivo"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          {authSession.user?.roles.includes('Arrendador') && (
                            <MenuItem onClick={() => openDeleteAlert(contract)}>
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
                          No se encontraron contratos.
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
            count={contracts.pagination?.totalItems ?? 0}
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

      {modalFile.open && (
        <ModalIframe opened={modalFile.open} url={modalFile.url} onCloseModal={closeModalFile} />
      )}

      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />
    </>
  );
};
