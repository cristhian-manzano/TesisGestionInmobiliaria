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
  Button
} from '@mui/material';

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
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/property/get-by-owner`,
      token: authSession.user?.token,
      method: 'POST'
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
  }, []);

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

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h4">Inmuebles</Typography>
          <Button component={RouterLink} to="create" variant="contained">
            Agregar
          </Button>
        </Box>
        <Card>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: '#E5E5E5' }}>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo de inmueble</TableCell>
                  <TableCell>Disponible</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {properties?.length > 0 ? (
                  properties.map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{row.tagName}</TableCell>
                      <TableCell>{row.typeProperty?.name}</TableCell>
                      <TableCell>{row.available ?? 'Si'}</TableCell>
                      <TableCell>{row.price}</TableCell>

                      <TableCell>
                        <TableMoreMenu
                          onView={() => onView(row.id)}
                          onUpdate={() => onUpdate(row.id)}
                          onDelete={() => openDeleteAlert(row)}
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
                          Aún no ha registrado propiedades.
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
