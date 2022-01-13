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

export const Property = () => {
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
    { name: 'Edificio Norte', available: 'Si', price: '$1000' },
    { name: 'Casa Sauces II', available: 'No', price: '$400' },
    { name: 'Edificio central', available: 'No', price: '$500' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h4">Propiedades</Typography>
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
                <TableCell>Disponible</TableCell>
                <TableCell>Precio</TableCell>
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
                  <TableCell>{row.available}</TableCell>
                  <TableCell>{row.price}</TableCell>

                  <TableCell>
                    <TableMoreMenu
                      onView={() => onView(row.name)}
                      onUpdate={() => onUpdate(row.name)}
                      onDelete={() => onDelete(row.name)}
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
