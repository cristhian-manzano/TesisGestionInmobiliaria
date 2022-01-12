import { AccountCircle, Logout } from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Divider,
  Typography,
  ListItemIcon
} from '@mui/material';
// import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/context/authContext';
import { logout } from '../../store/actions/authActions';

export const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Navigation
  const navigate = useNavigate();

  // User context
  const { userAuth, dispatch } = useContext(AuthContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(dispatch);
    navigate('/');
  };

  return (
    <>
      <Tooltip title="Opciones de cuenta">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}>
          <Avatar
            sx={{
              height: 35,
              width: 35,
              ml: 2
            }}
            src="/static/images/avatars/avatar_1.png"
          />
        </IconButton>
      </Tooltip>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {/*  */}

        <Box
          sx={{
            px: 2,
            display: 'flex',
            alignItems: 'center',
            maxWidth: 250,
            width: 250
          }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
            <Typography noWrap variant="body1">
              {`${userAuth.user?.firstName} ${userAuth.user?.lastName}`}
            </Typography>
            <Typography noWrap variant="body2">
              Administrador
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Salir
        </MenuItem>
      </Menu>
    </>
  );
};

AccountMenu.propTypes = {};
