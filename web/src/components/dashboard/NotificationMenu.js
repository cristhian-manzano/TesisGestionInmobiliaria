import { NotificationsNone, Visibility, WatchLater } from '@mui/icons-material';
import {
  Badge,
  Divider,
  IconButton,
  Menu,
  Tooltip,
  Typography,
  Box,
  Avatar,
  ListItemText,
  Button,
  ListItemAvatar,
  ListItemButton,
  List,
  Chip
} from '@mui/material';
import { useState } from 'react';

export const NotificationMenu = () => {
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
          <Badge badgeContent={4} color="primary">
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
            width: 380,
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
            display: 'flex',
            alignItems: 'center',
            py: 1,
            px: 2.5
          }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography noWrap variant="h5">
              Notificaciones
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {10} notificaciones nuevas
            </Typography>
          </Box>

          {10 > 0 && (
            <Tooltip title=" Marcar como leídas">
              <IconButton color="primary" onClick={() => console.log('Read!')}>
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        <List disablePadding sx={{ maxHeight: 310, overflow: 'scroll' }}>
          {[1, 2, 3, 4].map((e) => (
            <ListItemButton
              key={e}
              disableGutters
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(true && {
                  bgcolor: 'action.selected'
                })
              }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>P</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    Nueva observación
                    <Typography component="span" variant="body1" sx={{ color: 'text.secondary' }}>
                      &nbsp; Esta es una observación importante
                    </Typography>
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled'
                    }}>
                    <WatchLater sx={{ fontSize: 18, mr: 0.5 }} />
                    {`2020-01-${1}`}
                    <Chip sx={{ ml: 1 }} label="Nueva" color="warning" size="small" />
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <Box>
          <Button fullWidth disableRipple to="#">
            Ver todas
          </Button>
        </Box>
      </Menu>
    </>
  );
};

NotificationMenu.propTypes = {};
