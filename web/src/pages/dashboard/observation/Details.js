import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material/';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  CardActions,
  FormControl,
  TextField,
  Typography,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const observation = {
  property: 'Casa norte',
  description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta id nobis facilis facere nam, quibusdam mollitia ex minus iste maiores consequatur soluta eveniet necessitatibus hic vero. Quia voluptate necessitatibus rerum. Voluptatem, dolore. Saepe volupta`,
  date: '2020-01-01',
  solved: false,
  user: 'Cristhian Manzano'
};

export const Details = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
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
            title={observation.user}
            subheader={observation.date}
          />
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Departamento - Casa 123
            </Typography>
            Observation {id}
            {observation.description}
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleClickOpen}>
              Comentar
            </Button>
          </CardActions>
        </Card>

        <Dialog open={open} onClose={handleClose} fullWidth>
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
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleClose}>Enviar</Button>
          </DialogActions>
        </Dialog>

        <Box>
          <Divider sx={{ mt: 2 }}>
            <Chip label="COMENTARIOS" />
          </Divider>

          <Card sx={{ p: 3, my: 1 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ backgroundColor: 'red' }} aria-label="recipe">
                  R
                </Avatar>
              }
              title={observation.user}
              subheader={observation.date}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              Observation {id}
              {observation.description}
            </CardContent>
          </Card>

          {/*
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="h5" sx={{ my: 1 }}>
                Comentario
              </Typography>
              <FormControl fullWidth>
                <TextField
                  placeholder="Agregar comentario..."
                  multiline
                  maxRows={20}
                  minRows={5}
                  inputProps={{ maxLength: 2000 }}
                />
              </FormControl>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small">Enviar</Button>
              <Button size="small">Cancelar</Button>
            </CardActions>
          </Card> */}
        </Box>
      </Box>
    </Box>
  );
};
