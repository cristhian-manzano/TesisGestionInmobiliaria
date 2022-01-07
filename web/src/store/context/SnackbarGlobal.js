import { createContext, useState, useMemo } from 'react';
import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';

export const SnackbarContext = createContext('Cristhian manzano');

const SnackbarGlobal = ({ children }) => {
  const [openSnackbar, setOpenSnackbar] = useState({ open: false });

  const handleOpenSnackbar = (severity, message) => {
    setOpenSnackbar({
      open: true,
      severity,
      message
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar({
      open: false
    });
  };

  const values = useMemo(() => ({ handleOpenSnackbar }), []);

  return (
    <SnackbarContext.Provider value={values}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!openSnackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.severity ?? 'info'}
          sx={{ width: '100%' }}>
          {openSnackbar.message}
        </Alert>
      </Snackbar>

      {children}
    </SnackbarContext.Provider>
  );
};

SnackbarGlobal.propTypes = {
  children: PropTypes.node.isRequired
};

export default SnackbarGlobal;
