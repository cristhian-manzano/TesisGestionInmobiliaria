import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';

import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { useContract } from './useContract';
import { ModalIframe } from '../../../components/ModalIframe';

export const Details = () => {
  const { id } = useParams();

  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { api, data, error, loading } = useContract();

  const [modalFile, setModalFile] = useState({
    open: false,
    url: ''
  });

  const openModalFile = (urlFile) => {
    setModalFile({ open: true, url: urlFile });
  };

  const closeModalFile = () => setModalFile({ open: false, url: '' });

  useEffect(() => {
    handleLoading(loading);
  }, [loading]);

  useEffect(() => {
    api.get(id);
    if (error) handleOpenSnackbar('error', 'Cannot get contracts');
  }, [id]);

  return (
    <>
      <Box>
        <Button
          component={RouterLink}
          to="../"
          color="inherit"
          sx={{ opacity: 0.7, my: 1 }}
          aria-label="Example">
          <ArrowBack /> regresar
        </Button>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4">Detalles de contrato</Typography>
          <Box sx={{ my: 3 }}>
            <Grid container spacing={2} rowSpacing={5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Fecha de inicio</Typography>
                <Typography variant="body1">{data?.startDate || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Fecha de fin</Typography>
                <Typography variant="body1">{data?.endDate || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Estado</Typography>
                <Typography variant="body1">{data?.active ? 'Activo' : 'Inactivo'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Propiedad</Typography>
                <Typography variant="body1">{data?.property?.tagName || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Propietario</Typography>
                <Typography variant="body1">
                  {`${data?.owner?.firstName ?? ''} ${data?.owner?.lastName ?? ''}` || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Inquilino</Typography>
                <Typography variant="body1">
                  {`${data?.tenant?.firstName ?? ''} ${data?.tenant?.lastName ?? ''}` || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => openModalFile(data?.contractFile.url)}>
                    ver contrato
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>

      {modalFile.open && (
        <ModalIframe opened={modalFile.open} url={modalFile.url} onCloseModal={closeModalFile} />
      )}
    </>
  );
};
