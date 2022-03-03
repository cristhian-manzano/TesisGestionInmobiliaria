import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material';

import { AccountMenu } from '../../components/dashboard/AccountMenu';
import { NotificationMenu } from '../../components/dashboard/NotificationMenu';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = ({ onSidebarOpen }) => {
  return (
    <DashboardNavbarRoot
      sx={{
        left: {
          lg: 280
        },
        width: {
          lg: 'calc(100% - 280px)'
        }
      }}>
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2
        }}>
        <IconButton
          onClick={onSidebarOpen}
          sx={{
            display: {
              xs: 'inline-flex',
              lg: 'none'
            }
          }}>
          <Menu fontSize="small" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <NotificationMenu />
        <AccountMenu />
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func.isRequired
};
