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
  Divider
} from '@mui/material';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

import { TableMoreMenu } from '../../../components/TableMoreMenu';
import { sendRequest } from '../../../helpers/utils';

export const Property = () => {
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

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

  const onView = (id) => {
    navigate(`${id}`);
  };

  const onUpdate = (id) => {
    navigate(`update/${id}`);
  };

  // Este es el evento delete
  const onDelete = (id) => {
    /* eslint-disable no-console */
    console.log('ID: ', id);
    /* eslint-enable no-console */
  };

  return (
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
            <TableHead>
              <TableRow>
                <TableCell>Etiqueta</TableCell>
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
                        onUpdate={() => onUpdate(row.name)}
                        onDelete={() => onDelete(row.name)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Valida - que no salga esto si esta cargando...
                <TableRow>
                  <TableCell colSpan={5}>
                    <Divider />
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
  );
};
