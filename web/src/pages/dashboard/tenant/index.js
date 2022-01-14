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
  Paper
} from '@mui/material';

import { TableMoreMenu } from '../../../components/TableMoreMenu';

const rows = [
  { name: 'Cristhian Manzano', email: 'cristhian@gmail.com', phone: '01282822', apartment: 1 },
  { name: 'Erick Luna', email: 'erick@gmail.com', phone: '22090933', apartment: 2 }
];

export const Tenant = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h4">Inquilinos</Typography>
        {/* <Button variant="contained">Agregar</Button> */}
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
                      onView={() => console.log(row.name)}
                      onUpdate={() => console.log(row.name)}
                      onDelete={() => console.log(row.name)}
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
  );
};
