import { useState, useEffect, useContext } from 'react';
import { Clear, Comment } from '@mui/icons-material/';
import PropTypes from 'prop-types';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  FormHelperText
} from '@mui/material';

import { Alert } from '../../../components/Alert';

import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';
import { LoadingContext } from '../../../store/context/LoadingGlobal';
import { SnackbarContext } from '../../../store/context/SnackbarGlobal';

export const Comments = ({ observation, openComments }) => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  // contexts
  const { authSession } = useContext(AuthContext);
  const { handleLoading } = useContext(LoadingContext);
  const { handleOpenSnackbar } = useContext(SnackbarContext);

  const [selectedComment, setSelectedComment] = useState(null);

  const [alert, setAlert] = useState({ open: false, title: '', description: '' });

  const { register, handleSubmit, reset, formState } = useForm();

  const handleOpenDialog = (condition) => {
    setOpen(condition);
    reset(); // Clear Form
  };

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
    if (observation?.id) fetchComments();
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

  const openDeleteAlert = (comment) => {
    setSelectedComment(comment);

    setAlert({
      open: true,
      title: `¿Está seguro que desea eliminar el comentario'?`,
      description:
        'Al aceptar se eliminará el comentario de manera permanente y no podrá deshacer los cambios.'
    });
  };

  const closeDeleteAlert = () => {
    setSelectedComment(null);
    setAlert((previous) => ({
      ...previous,
      open: false
    }));
  };
  const onDelete = async () => {
    handleLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/comment/${selectedComment?.id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    handleLoading(false);
    if (response.error) {
      handleOpenSnackbar('error', 'No se pudo elimnar el comentario!');
    } else {
      await fetchComments();
      handleOpenSnackbar('success', 'Comentario eliminado exitosamente!');
    }
  };

  return (
    <>
      <Alert state={alert} closeAlert={closeDeleteAlert} onConfirm={() => onDelete()} />

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

      <Box>
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
                    <IconButton aria-label="delete" onClick={() => openDeleteAlert(comment)}>
                      <Clear color="error" />
                    </IconButton>
                  }
                />
                <CardContent>{comment?.description}</CardContent>
              </Card>
            ))}
        </Box>
      </Box>
    </>
  );
};

Comments.defaultProps = {
  observation: {}
};

Comments.propTypes = {
  observation: PropTypes.shape({ id: PropTypes.string }),
  openComments: PropTypes.bool.isRequired
};