import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { ArrowBack, ArrowDropDown, ArrowDropUp } from '@mui/icons-material/';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Typography,
  Divider
} from '@mui/material';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';
import { Comments } from './Comments';
import { sendRequest } from '../../../helpers/utils';

export const Details = () => {
  const { id } = useParams();
  const [openComments, setOpenComments] = useState(true);
  // contexts
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [observation, setObservation] = useState(null);

  const handleOpenComments = () => setOpenComments((previous) => !previous);

  const fetchObservation = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/observation/${id}`,
      method: 'GET',
      token: `${authSession?.user?.token}`
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo obtener el contrato!');
    } else {
      setObservation(response.data?.data || {});
    }
  };

  useEffect(() => {
    fetchObservation();
  }, []);

  return (
    <Box sx={{ mb: '100px' }}>
      <Button
        component={RouterLink}
        to="../"
        color="inherit"
        sx={{ opacity: 0.7, my: 1 }}
        aria-label="Example">
        <ArrowBack /> regresar
      </Button>

      {observation && (
        <Box>
          <Card sx={{ p: 3, my: 1 }}>
            <CardHeader
              avatar={<Avatar aria-label="recipe">{observation?.user?.firstName.charAt(0)}</Avatar>}
              title={
                observation.user?.email === authSession.user?.email
                  ? 'Yo'
                  : `${observation?.user?.firstName ?? ''} ${observation?.user?.lastName ?? ''}`
              }
              subheader={new Date(observation?.date).toLocaleString('es-ES')}
            />
            <CardContent>
              <Box sx={{ maxWidth: '100vw', overflow: 'hidden' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {observation?.property?.tagName ?? ''}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {observation?.description}
                </Typography>

                {observation.observationImage && (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
                    <img height={350} alt="Is bad" src={observation.observationImage?.url} />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          <Box>
            <Divider sx={{ mt: 2 }}>
              <Button onClick={handleOpenComments} color="secondary">
                {openComments ? 'Ocultar comentarios' : 'Ver comentarios'}{' '}
                {openComments ? <ArrowDropUp /> : <ArrowDropDown />}
              </Button>
            </Divider>

            <Comments observation={observation} openComments={openComments} />
          </Box>
        </Box>
      )}
    </Box>
  );
};
