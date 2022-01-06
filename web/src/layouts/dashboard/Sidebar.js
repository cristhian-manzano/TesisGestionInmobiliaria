import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { NavItem } from '../../components/dashboard/NavItem';
import { sidebarConfig } from './SidebarConfig';
import LogoImage from '../../assets/img/logo.png';

export const DashboardSidebar = ({ open, onClose }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
      <div>
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Box component={Link} to="/dashboard">
            <img src={LogoImage} alt="logo" height={40} width={40} />
          </Box>
        </Box>
        <Box sx={{ px: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: '11px',
              borderRadius: 1
            }}>
            <div>
              <Typography color="inherit" variant="subtitle1">
                Cristhian Manzano
              </Typography>
              <Typography color="neutral.400" variant="body2">
                Administrador
              </Typography>
            </div>
          </Box>
        </Box>
      </div>
      <Divider
        sx={{
          borderColor: '#2D3748',
          my: 3
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        {sidebarConfig.map((item) => (
          <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
        ))}
      </Box>
      <Divider sx={{ borderColor: '#2D3748' }} />
      <Box
        sx={{
          px: 2,
          py: 3
        }}>
        <Typography color="neutral.100" variant="subtitle2">
          Proyecto inmobiliario
        </Typography>
        <Typography color="neutral.500" variant="body2">
          Tésis - Universidad de Guayaquil
        </Typography>
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent">
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary">
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
