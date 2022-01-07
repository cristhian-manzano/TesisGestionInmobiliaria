import { createContext, useState, useMemo } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

export const LoadingContext = createContext();

const LoadingGlobal = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleLoadingClose = () => {
    setOpen(false);
  };
  const handleLoadingOpen = () => {
    setOpen(!open);
  };

  const values = useMemo(() => ({ handleLoadingOpen, handleLoadingClose }), []);

  return (
    <LoadingContext.Provider value={values}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleLoadingClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </LoadingContext.Provider>
  );
};

LoadingGlobal.propTypes = {
  children: PropTypes.node.isRequired
};

export default LoadingGlobal;
