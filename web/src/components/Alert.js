import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import PropTypes from 'prop-types';

export const Alert = ({ state, closeAlert, onConfirm }) => {
  const handleClose = () => {
    closeAlert();
  };

  const handleOnConfirm = () => {
    closeAlert();
    onConfirm();
  };

  return (
    <Dialog
      open={state.open ?? false}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{state.title ?? ''}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {state.description ?? ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleOnConfirm} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Alert.propTypes = {
  state: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  closeAlert: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};
