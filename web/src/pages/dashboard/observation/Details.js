import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { ArrowBack, MoreVert, ArrowDropDown, ArrowDropUp, Comment } from '@mui/icons-material/';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  FormControl,
  TextField,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab
} from '@mui/material';

import { sendRequest } from '../../../helpers/utils';

import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

const observationx = {
  property: 'Casa norte',
  description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta id nobis facilis facere nam, quibusdam mollitia ex minus iste maiores consequatur soluta eveniet necessitatibus hic vero. Quia voluptate necessitatibus rerum. Voluptatem, dolore. Saepe volupta`,
  date: '2020-01-01',
  solved: false,
  user: 'Cristhian Manzano'
};

export const Details = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [observation, setObservation] = useState({});

  const handleOpenComments = () => setOpenComments((previous) => !previous);
  const handleOpenDialog = (condition) => setOpen(condition);

  const fetchObservation = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `http://localhost:3200/observation/${id}`,
      method: 'GET',
      token: `${authSession?.user?.token}`
    });

    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'Cannot get observation');
      return;
    }

    setObservation(response.data?.data);
  };

  useEffect(() => {
    fetchObservation();
  }, []);

  return (
    <Box sx={{ mb: '100px' }}>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog(true)}
        sx={{
          margin: 0,
          top: 'auto',
          right: 40,
          bottom: 40,
          left: 'auto',
          position: 'fixed',
          zIndex: 1000
        }}>
        <Comment sx={{ mr: 1 }} />
        COMENTAR
      </Fab>

      <Button
        component={RouterLink}
        to="../"
        color="inherit"
        sx={{ opacity: 0.7, my: 1 }}
        aria-label="Example">
        <ArrowBack /> regresar
      </Button>

      <Box>
        <Card sx={{ p: 3, my: 1 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ backgroundColor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
            title={observationx.user}
            subheader={observationx.date}
          />
          <CardContent>
            <Box sx={{ maxWidth: '100vw', overflow: 'hidden' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Departamento - Casa 123{' '}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {observation.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Dialog open={open} onClose={() => handleOpenDialog(false)} fullWidth>
          <DialogTitle>Comentario</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <TextField
                placeholder="Agregar comentario..."
                multiline
                maxRows={20}
                minRows={5}
                inputProps={{ maxLength: 2000 }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleOpenDialog(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                handleOpenDialog(false);
              }}>
              Enviar
            </Button>
          </DialogActions>
        </Dialog>

        <Box>
          <Divider sx={{ mt: 2 }}>
            {/* <Chip label="COMENTARIOS" /> */}
            <Button onClick={handleOpenComments} color="secondary">
              {openComments ? 'Ocultar comentarios' : 'Ver comentarios'}{' '}
              {openComments ? <ArrowDropUp /> : <ArrowDropDown />}
            </Button>
          </Divider>

          {openComments && (
            <Card sx={{ p: 3, my: 1 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ backgroundColor: 'red' }} aria-label="recipe">
                    R
                  </Avatar>
                }
                title={observationx.user}
                subheader={observationx.date}
                // action={
                //   <IconButton aria-label="settings">
                //     <MoreVert />
                //   </IconButton>
                // }
              />
              <CardContent>
                Observation {id}
                {observationx.description}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};
