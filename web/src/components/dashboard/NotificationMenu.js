import { useState, useEffect, useContext } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import {
  NotificationsNone,
  Visibility,
  WatchLater,
  RateReview,
  Chat,
  CreditCardOff,
  Article
} from '@mui/icons-material';

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

import { sendRequest } from '../../helpers/utils';
import { AuthContext } from '../../store/context/authContext';
import { LoadingContext } from '../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../store/context/SnackbarGlobal';

const routesLink = {
  PendingPayment: '/dashboard/payments',
  FinishContract: '/dashboard/contracts',
  Observation: '/dashboard/observations',
  Comment: '/dashboard/observations'
};

export const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [notifications, setNotifications] = useState({ data: [], newNotifications: 0 });

  const fetchNotifications = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/notification`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      // handleOpenSnackbar('error', 'Hubo un error al obtener las notificaciones.');
    } else {
      const newNotifications = response.data.data?.reduce((prev, cur) => {
        if (!cur.read) {
          return prev + 1;
        }
        return prev;
      }, 0);

      setNotifications({ data: response.data.data, newNotifications });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const readAll = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/notification`,
      token: authSession.user?.token,
      method: 'PUT'
    });
    handleLoading(false);

    if (response.error) {
      // handleOpenSnackbar('error', 'Hubo un error al obtener las notificaciones.');
    } else {
      fetchNotifications();
    }
  };

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
          <Badge badgeContent={notifications?.newNotifications ?? 0} color="primary">
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
              {notifications.newNotifications > 0
                ? `${notifications.newNotifications} notificaciones nuevas`
                : `No hay notificaciones nuevas.`}
            </Typography>
          </Box>

          {notifications.newNotifications > 0 && (
            <Tooltip title=" Marcar como leídas">
              <IconButton color="primary" onClick={readAll}>
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        <List disablePadding sx={{ maxHeight: 310, overflow: 'scroll' }}>
          {notifications.data?.map((notification) => (
            <RouterLink
              to={
                notification.entity === 'PendingPayment'
                  ? routesLink[notification.entity]
                  : `${routesLink[notification.entity]}/${notification.idEntity}`
              }
              key={notification.id}
              style={{ textDecoration: 'none', color: 'black' }}>
              <ListItemButton
                disableGutters
                sx={{
                  py: 1.5,
                  px: 2.5,
                  mt: '1px',
                  ...(!notification.read && {
                    bgcolor: 'action.selected'
                  })
                }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.neutral' }}>
                    {notification.entity === 'Observation' && <RateReview />}
                    {notification.entity === 'Comment' && <Chat />}
                    {notification.entity === 'PendingPayment' && <CreditCardOff />}
                    {notification.entity === 'FinishContract' && <Article />}
                    {notification.entity === 'PaymentObservation' && <RateReview />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {notification.entity === 'Observation' && 'Nueva observación'}
                      {notification.entity === 'Comment' && 'Nuevo comentario'}
                      {notification.entity === 'PendingPayment' && 'Pago pendiente'}
                      {notification.entity === 'FinishContract' && 'Contrato finalizado'}
                      {notification.entity === 'PaymentObservation' && 'Observación de pago'}
                      <Typography component="span" variant="body1" sx={{ color: 'text.secondary' }}>
                        &nbsp; {notification.description}
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
                      {new Date(notification?.date).toLocaleString('es-ES')}

                      {!notification.read && (
                        <Chip sx={{ ml: 1 }} label="Nueva" color="warning" size="small" />
                      )}
                    </Typography>
                  }
                />
              </ListItemButton>
            </RouterLink>
          ))}
        </List>

        <Divider />

        <Box>
          {/* <Button fullWidth disableRipple to="#">
            Ver todas
          </Button> */}
        </Box>
      </Menu>
    </>
  );
};

NotificationMenu.propTypes = {};
