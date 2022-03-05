import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Typography, Card, Button, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material/';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

import { ModalIframe } from '../../../components/ModalIframe';
import { sendRequest } from '../../../helpers/utils';

export const Details = () => {
  const { id } = useParams();

  const { authSession } = useContext(AuthContext);

  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [contract, setContract] = useState({});

  const [modalFile, setModalFile] = useState({
    open: false,
    url: ''
  });

  const openModalFile = (urlFile) => {
    setModalFile({ open: true, url: urlFile });
  };

  const closeModalFile = () => setModalFile({ open: false, url: '' });

  const fetchContract = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/contracts/${id}`,
      token: authSession.user?.token,
      method: 'GET'
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo obtener el contrato!');
    } else {
      setContract(response.data?.data || {});
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

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
                <Typography variant="body1">{contract?.startDate || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Fecha de fin</Typography>
                <Typography variant="body1">{contract?.endDate || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Estado</Typography>
                <Typography variant="body1">{contract?.active ? 'Activo' : 'Inactivo'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Propiedad</Typography>
                <Typography variant="body1">{contract?.property?.tagName || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Propietario</Typography>
                <Typography variant="body1">
                  {`${contract?.owner?.firstName ?? ''} ${contract?.owner?.lastName ?? ''}` || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Inquilino</Typography>
                <Typography variant="body1">
                  {`${contract?.tenant?.firstName ?? ''} ${contract?.tenant?.lastName ?? ''}` ||
                    '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => openModalFile(contract?.contractFile.url)}>
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
