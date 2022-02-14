import { useState, useEffect } from 'react';
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

import { Search, Visibility, Edit, Delete } from '@mui/icons-material';
import { Alert } from '../../../components/Alert';
import { TableMoreMenu } from '../../../components/TableMoreMenu';

export const Contract = () => {
  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });
  const [contracts, setContract] = useState([]);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onView = (id) => navigate(`${id}`);
  const onUpdate = (id) => navigate(`update/${id}`);

  useEffect(() => {
    setContract([]);
  }, []);

  const openDeleteAlert = (payment) => {
    setSelectedPayment(payment);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar el contrato '${payment?.tenant?.firstName} ${payment?.tenant?.lastName}'?`,
      description:
        'Al aceptar se eliminará el contrato de manera permanente y no podrá deshacer los cambios.'
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
    console.log(selectedPayment);
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
          <Typography variant="h4">Contratos</Typography>
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
                  <TableCell>Fecha de inicio</TableCell>
                  <TableCell>Fecha de fin</TableCell>
                  <TableCell>Archivo</TableCell>
                  <TableCell>Activo</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.length > 0 ? (
                  contracts.map((contract) => (
                    <TableRow
                      hover
                      key={contract?.x ?? ''}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{contract?.x ?? ''}</TableCell>
                      <TableCell>{contract?.x ?? ''}</TableCell>
                      <TableCell>{contract?.x ?? ''}</TableCell>
                      <TableCell>{contract?.x ?? ''}</TableCell>

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

                          <MenuItem onClick={() => onUpdate(contract?.x ?? '')}>
                            <ListItemIcon>
                              <Edit sx={{ fontSize: 25 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Editar"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </MenuItem>

                          <MenuItem onClick={() => openDeleteAlert(contract?.x ?? '')}>
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
                          Aún no hay contratos registrados
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
