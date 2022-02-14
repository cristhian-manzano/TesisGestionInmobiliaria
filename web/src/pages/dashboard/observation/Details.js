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
import { useObservation } from './useObservation';

export const Details = () => {
  const { id } = useParams();
  const [openComments, setOpenComments] = useState(true);
  // contexts
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);
  const { api, data, error, loading } = useObservation();

  const handleOpenComments = () => setOpenComments((previous) => !previous);

  useEffect(() => {
    handleLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    api.details(id);
    if (error) handleOpenSnackbar('error', 'Cannot get observation');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {data && (
        <Box>
          <Card sx={{ p: 3, my: 1 }}>
            <CardHeader
              avatar={<Avatar aria-label="recipe">R</Avatar>}
              title={
                data.user?.email === authSession.user?.email
                  ? 'Yo'
                  : `${data?.user?.firstName ?? ''} ${data?.user?.lastName ?? ''}`
              }
              subheader={new Date(data?.date).toLocaleString()}
            />
            <CardContent>
              <Box sx={{ maxWidth: '100vw', overflow: 'hidden' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {data?.property?.tagName ?? ''}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {data?.description}
                </Typography>
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

            <Comments observation={data} openComments={openComments} />
          </Box>
        </Box>
      )}
    </Box>
  );
};
