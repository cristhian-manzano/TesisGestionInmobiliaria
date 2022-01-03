import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography, useMediaQuery, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { NavItem } from './NavItem';
import { sidebarConfig } from './SidebarConfig';
import LogoImage from '../assets/img/logo.png';

export const DashboardSidebar = ({ open, onClose }) => {
  const { pathname } = useLocation();

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

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
          <Link href="/">
            <img src={LogoImage} alt="logo" height={40} width={40} />
          </Link>
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
