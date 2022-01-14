import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LogoImage from '../assets/img/logo.png';

import ImageLandingPage from '../assets/img/BuildingsLandingPage.jpeg';

export const HomePage = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="default">
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
      {/* <Toolbar /> */}

      <Box
        sx={{
          p: 4,
          flex: '1 1 auto',
          backgroundImage: `url(${ImageLandingPage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Card sx={{ p: 3, width: '700px' }}>
          <Typography variant="h4" sx={{ opacity: 0.6 }}>
            Buscar inmuebles en alquiler
          </Typography>

          <Grid container sx={{ my: 2 }} rowSpacing={1}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={1}
                  label="Age"
                  // onChange={handleChange}
                >
                  <MenuItem value={1}>Casa</MenuItem>
                  <MenuItem value={2}>Departamento</MenuItem>
                  <MenuItem value={3}>Local comercial</MenuItem>
                  <MenuItem value={4}>Edificio</MenuItem>
                  <MenuItem value={5}>Terreno</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField fullWidth placeholder="Ingresar sector a buscar" id="fullWidth" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" sx={{ py: 2 }}>
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};
