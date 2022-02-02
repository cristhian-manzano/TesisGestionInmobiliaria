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
  Button
} from '@mui/material';

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

  const onView = (id) => navigate(`${id}`);
  const onUpdate = (id) => navigate(`update/${id}`);

  const openDeleteAlert = (tenantRent) => {
    setSelectedTenant(tenantRent);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar el inquilino '${tenantRent?.tenant?.firstName} ${tenantRent?.tenant?.lastName}'?`,
      description:
        'Al aceptar se eliminará el inquilino de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const fetchTenantsRent = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent`,
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

  const closeDeleteAlert = () => {
    setSelectedTenant(null);
    setAlert((previous) => ({
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

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h4">Inquilinos</Typography>
          <Button component={RouterLink} to="create" variant="contained">
            Agregar
          </Button>
        </Box>
        <Card>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Apartamento</TableCell>
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
                      <TableCell>{rent?.tenant?.firstName}</TableCell>
                      <TableCell>{rent?.tenant?.email}</TableCell>
                      <TableCell>{rent?.tenant?.phone}</TableCell>
                      <TableCell>{rent?.property?.tagName}</TableCell>

                      <TableCell>
                        <TableMoreMenu
                          onView={() => onView(rent?.id)}
                          onUpdate={() => onUpdate(rent?.id)}
                          onDelete={() => openDeleteAlert(rent)}
                        />
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
        </Card>
      </Box>
      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />
    </>
  );
};
