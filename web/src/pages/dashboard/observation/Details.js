import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { ArrowBack, Clear, ArrowDropDown, ArrowDropUp, Comment } from '@mui/icons-material/';

import { useForm } from 'react-hook-form';

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
  Fab,
  IconButton,
  FormHelperText
} from '@mui/material';

import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Details = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [observation, setObservation] = useState(null);
  const [comments, setComments] = useState([]);
  // contexts
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const { register, handleSubmit, reset, formState } = useForm();

  const handleOpenComments = () => setOpenComments((previous) => !previous);

  const handleOpenDialog = (condition) => {
    setOpen(condition);
    reset(); // Clear Form
  };

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

  const fetchComments = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `http://localhost:3200/comment/${observation?.id}`,
      method: 'GET',
      token: `${authSession?.user?.token}`
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'Cannot get comments');
      return;
    }
    setComments(response.data?.data);
  };

  useEffect(() => {
    if (observation) fetchComments();
  }, [observation]);

  const handleSubmitComment = async (data) => {
    const dataToSend = { ...data, idObservation: observation?.id };

    handleLoading(true);
    const response = await sendRequest({
      urlPath: `http://localhost:3200/comment`,
      method: 'POST',
      token: authSession.user?.token,
      data: dataToSend
    });
    handleLoading(false);

    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo crear!');
    } else {
      handleOpenSnackbar('success', 'Creado exitosamente!');
      handleOpenDialog(false);
    }
    fetchComments();
  };

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
            title="observation.user"
            subheader="observation.date"
          />
          <CardContent>
            <Box sx={{ maxWidth: '100vw', overflow: 'hidden' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Departamento - Casa 123{' '}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {observation?.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Dialog open={open} onClose={() => handleOpenDialog(false)} fullWidth>
          <Box component="form" onSubmit={handleSubmit(handleSubmitComment)}>
            <DialogTitle>Comentario</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <TextField
                  {...register('description', { required: true, maxLength: 200 })}
                  placeholder="Agregar comentario..."
                  multiline
                  maxRows={20}
                  minRows={5}
                  inputProps={{ maxLength: 2000 }}
                />
                <FormHelperText error>
                  {formState.errors.description?.type === 'required' && 'descripción requerida'}
                  {formState.errors.description?.type === 'maxLength' &&
                    'Longitud máxima permitidad: 200'}
                </FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleOpenDialog(false)}>Cancelar</Button>
              <Button type="submit">Enviar</Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Box>
          <Divider sx={{ mt: 2 }}>
            <Button onClick={handleOpenComments} color="secondary">
              {openComments ? 'Ocultar comentarios' : 'Ver comentarios'}{' '}
              {openComments ? <ArrowDropUp /> : <ArrowDropDown />}
            </Button>
          </Divider>

          {openComments &&
            comments.map((comment) => (
              <Card key={comment?.id} sx={{ p: 3, my: 1 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ backgroundColor: 'red' }} aria-label="recipe">
                      R
                    </Avatar>
                  }
                  title="comment.user"
                  subheader={comment?.date}
                  action={
                    <IconButton aria-label="delete">
                      <Clear color="error" />
                    </IconButton>
                  }
                />
                <CardContent>
                  Observation {id}
                  {comment?.description}
                </CardContent>
              </Card>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
