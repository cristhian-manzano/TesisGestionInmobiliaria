import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoImage from '../assets/img/logo.png';

export const HomePage = () => {
  return (
    <>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Box sx={{ mr: 2 }}>
            <img src={LogoImage} alt="logo" height={35} width={35} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Proyecto inmobiliario
          </Typography>

          <Box>
            <Button
              component={Link}
              to="/dashboard"
              variant="text"
              color="secondary"
              sx={{ my: 1, mx: 1 }}>
              Dashboard
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="text"
              color="secondary"
              sx={{ my: 1, mx: 1 }}>
              Iniciar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Box sx={{ p: 4 }}>
        <Typography variant="h5" noWrap component="div" sx={{ textAlign: 'center' }}>
          Página de inicio
        </Typography>
      </Box>
    </>
  );
};
