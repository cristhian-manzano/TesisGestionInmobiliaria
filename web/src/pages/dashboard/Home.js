import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Card
} from '@mui/material';

import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../store/context/authContext';

export const Home = () => {
  const { authSession } = useContext(AuthContext);

  // dashboard/users

  if (authSession.user?.roles.includes('Administrador')) {
    return <Navigate to="/dashboard/users" />;
  }

  if (authSession.user?.roles.includes('Arrendador')) {
    return <Navigate to="/dashboard/tenants" />;
  }

  if (authSession.user?.roles.includes('Arrendatario')) {
    return <Navigate to="/dashboard/rents" />;
  }

  return <Navigate to="/" />;

  // return authSession.user?.roles.includes('Arrendador') ? (
  //   <Navigate to="/dashboard/tenants" />
  // ) : (
  //   <Navigate to="/dashboard/rents" />
  // );

  // return (
  //   <Box>
  //     <Grid container spacing={3}>
  //       <Grid item lg={3} sm={6} xl={3} xs={12}>
  //         <Card sx={{ p: 3, textAlign: 'center' }}>
  //           <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
  //             Nuevas observaciones
  //           </Typography>
  //           <Typography variant="h5" sx={{ mt: 1 }}>
  //             -
  //           </Typography>
  //         </Card>
  //       </Grid>
  //       <Grid item lg={3} sm={6} xl={3} xs={12}>
  //         <Card sx={{ p: 3, textAlign: 'center' }}>
  //           <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
  //             Inquilinos pendientes
  //           </Typography>
  //           <Typography variant="h5" sx={{ mt: 1 }}>
  //             -
  //           </Typography>
  //         </Card>
  //       </Grid>
  //       <Grid item lg={3} sm={6} xl={3} xs={12}>
  //         <Card sx={{ p: 3, textAlign: 'center' }}>
  //           <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
  //             Cantidad de inquilinos
  //           </Typography>
  //           <Typography variant="h5" sx={{ mt: 1 }}>
  //             -
  //           </Typography>
  //         </Card>
  //       </Grid>
  //       <Grid item lg={3} sm={6} xl={3} xs={12}>
  //         <Card sx={{ p: 3, textAlign: 'center' }}>
  //           <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
  //             Ingresos mes actual
  //           </Typography>
  //           <Typography variant="h5" sx={{ mt: 1 }}>
  //             $ -
  //           </Typography>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //     <Box sx={{ py: 3 }}>
  //       <Card>
  //         <Box sx={{ m: 3 }}>
  //           <Typography variant="h5">Inquilinos pendientes</Typography>
  //           <Divider sx={{ my: 2 }} />
  //         </Box>
  //         <TableContainer component={Paper}>
  //           <Table sx={{ minWidth: 800 }} aria-label="simple table">
  //             <TableHead>
  //               <TableRow>
  //                 <TableCell>Nombre</TableCell>
  //                 <TableCell>Email</TableCell>
  //                 <TableCell>Teléfono</TableCell>
  //                 <TableCell>Departamento</TableCell>
  //                 <TableCell>Fecha</TableCell>
  //                 <TableCell>Pago</TableCell>
  //               </TableRow>
  //             </TableHead>
  //             <TableBody>
  //               {rows.map((row) => (
  //                 <TableRow
  //                   hover
  //                   key={row.id}
  //                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
  //                   <TableCell>{row.name}</TableCell>
  //                   <TableCell>{row.email}</TableCell>
  //                   <TableCell>{row.phone}</TableCell>
  //                   <TableCell>{row.apartment ? 'Si' : 'No'}</TableCell>
  //                   <TableCell>{row.date}</TableCell>
  //                   <TableCell>{row.payment}</TableCell>
  //                 </TableRow>
  //               ))}
  //             </TableBody>
  //           </Table>
  //         </TableContainer>
  //       </Card>
  //     </Box>
  //   </Box>
  // );
};
