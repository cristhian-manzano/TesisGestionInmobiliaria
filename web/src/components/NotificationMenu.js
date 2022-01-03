import { NotificationsNone } from '@mui/icons-material';
import {
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import { useState } from 'react';
// import PropTypes from 'prop-types';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'notification-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}>
          <Badge badgeContent={4} color="primary" variant="dot">
            <NotificationsNone />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notification-menu"
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
        <Box
          sx={{
            px: 2,
            display: 'flex',
            alignItems: 'center',
            maxWidth: 350,
            width: 350
          }}>
          <Typography noWrap variant="h5">
            Notificaciones
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleClose}>Item 1</MenuItem>
      </Menu>
    </>
  );
};

NotificationMenu.propTypes = {};

export default NotificationMenu;
