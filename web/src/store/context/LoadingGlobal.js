import { createContext, useState, useMemo } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

export const LoadingContext = createContext();

export const LoadingGlobal = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleLoading = (newState) => {
    setOpen(newState);
  };

  const values = useMemo(() => ({ handleLoading }), []);

  return (
    <LoadingContext.Provider value={values}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={open}
        // onClick={() => handleLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </LoadingContext.Provider>
  );
};

LoadingGlobal.propTypes = {
  children: PropTypes.node.isRequired
};
