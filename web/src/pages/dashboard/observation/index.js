import React from 'react';

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

import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { TableMoreMenu } from '../../../components/TableMoreMenu';

export const Observation = () => {
  const navigate = useNavigate();

  const onView = (id) => {
    navigate(id);
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

  // Temporal data
  const rows = [
    {
      id: 1,
      observation: 'Se descompuso la puerta de la entrada',
      property: 'Casa norte',
      date: '16-10-2021',
      solved: true
    },
    {
      id: 2,
      observation: 'Se averió el lavabo del baño',
      property: 'Departamento samborondón',
      date: '16-10-2021',
      solved: false
    },
    {
      id: 3,
      observation: 'Se daño la pared',
      property: 'Local alborada',
      date: '16-10-2021',
      solved: true
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h4">Observaciones</Typography>
        <Button component={RouterLink} to="create" variant="contained">
          Agregar
        </Button>
      </Box>
      <Card>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Observación</TableCell>
                <TableCell>Propiedad</TableCell>
                <TableCell>Solucionado</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.observation}</TableCell>
                  <TableCell>{row.property}</TableCell>
                  <TableCell>{row.solved ? 'Si' : 'No'}</TableCell>
                  <TableCell>{row.date}</TableCell>

                  <TableCell>
                    <TableMoreMenu
                      onView={() => onView(row.id)}
                      onUpdate={() => onUpdate(row.id)}
                      onDelete={() => onDelete(row.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
