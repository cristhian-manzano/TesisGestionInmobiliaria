import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Modal } from '@mui/material';
import { saveAs } from 'file-saver';

export const ModalIframe = ({ opened, url, onCloseModal }) => {
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    const validateUrl = async () => {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        setErrorLoading(true);
      }
    };

    validateUrl();
  }, [url]);

  const saveFile = () => {
    const name = decodeURI(url).split('/').slice(-1)[0];
    saveAs(url, name);
  };

  return (
    <Modal
      open={opened}
      onClose={onCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
          boxShadow: 24,
          width: '90%',
          height: '90%'
        }}>
        {!errorLoading ? (
          <iframe
            title="Contract document"
            style={{
              flexGrow: 1,
              width: '100%'
            }}
            src={url}
          />
        ) : (
          <Box
            sx={{
              flexFlow: 1
            }}>
            <h2>Error al cargar el archivo.</h2>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            my: 2,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Button sx={{ m: 1 }} color="primary" variant="contained" onClick={saveFile}>
            descargar
          </Button>

          <Button sx={{ m: 1 }} color="inherit" variant="contained" onClick={onCloseModal}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ModalIframe.propTypes = {
  opened: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired
};
