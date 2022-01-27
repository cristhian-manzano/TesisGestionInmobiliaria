import { useState } from 'react';
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

const rows = [
  {
    id: 1,
    name: 'Cristhian Manzano',
    email: 'cristhian@gmail.com',
    phone: '01282822',
    apartment: 1
  },
  { id: 2, name: 'Erick Luna', email: 'erick@gmail.com', phone: '22090933', apartment: 2 }
];

export const Tenant = () => {
  const navigate = useNavigate();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [alert, setAlert] = useState({ open: false, title: '', description: '' });

  const onView = (id) => navigate(`${id}`);
  const onUpdate = (id) => navigate(`update/${id}`);

  const openDeleteAlert = (property) => {
    setSelectedProperty(property);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar el inquilino '${property.tagName}'?`,
      description:
        'Al aceptar se eliminará el inquilino de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeDeleteAlert = () => {
    setSelectedProperty(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };

  const onDelete = async () => {
    console.log('DELETING: ', selectedProperty?.id);
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
                {rows.map((row) => (
                  <TableRow
                    hover
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.apartment}</TableCell>

                    <TableCell>
                      {/* eslint-disable no-console */}
                      <TableMoreMenu
                        onView={() => onView(row.id)}
                        onUpdate={() => onUpdate(row.id)}
                        onDelete={() => openDeleteAlert(row)}
                      />
                      {/* eslint-enable no-console */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />
    </>
  );
};
