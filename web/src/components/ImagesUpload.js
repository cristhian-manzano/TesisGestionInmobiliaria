import PropTypes from 'prop-types';

import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton
  // InputAdornment
} from '@mui/material';

import { AddCircleOutline, Delete } from '@mui/icons-material/';

export const ImagesUpload = ({ images, onChangeImages }) => {
  const uploadImage = (e) => {
    const uploadedImages = images.uploaded;

    [...e.target.files]?.forEach((image, index) => {
      // Condición para solo subir archivos < 5 MB
      if (parseFloat(image.size / 1024 ** 2) > 5) return;

      // Condición para no subir si se sobrepasa el limite establecido (8 por ahora)
      if (e.target.files.length - index + images.loaded.length + images.uploaded.length > 8) return;

      uploadedImages.push({
        id: `${image.name}-${Date.now()}`,
        url: URL.createObjectURL(image),
        file: image
      });
    });

    // Clean input component
    e.target.value = null;
    onChangeImages({ ...images, uploaded: uploadedImages });
  };

  const onDeleteImage = (id) => {
    const imagesDeleted = images.deleted;

    const loadedFiltered = images.loaded.filter((image) => {
      if (image.id !== id) return true;
      imagesDeleted.push(image);
      return false;
    });
    const uploadedFiltered = images.uploaded.filter((image) => image.id !== id);
    onChangeImages({ loaded: loadedFiltered, uploaded: uploadedFiltered, deleted: imagesDeleted });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #DDDDDD' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          my: 1
        }}>
        <Typography variant="h5">Imágenes</Typography>

        <label htmlFor="btn-upload">
          <input
            type="file"
            id="btn-upload"
            style={{ display: 'none' }}
            multiple
            accept=".jpg, .jpeg, .png"
            onChange={uploadImage}
          />
          <Button variant="outlined" component="span">
            <AddCircleOutline />
            Agregar
          </Button>
        </label>
      </Box>

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        alignItems="center"
        sx={{ overflow: 'auto' }}>
        {[...images.loaded, ...images.uploaded].map((image) => (
          <Box
            key={image?.id}
            sx={{
              display: 'flex',
              position: 'relative'
            }}>
            <a href={image?.url} target="_blank" rel="noreferrer">
              <img src={image?.url} alt="Imagen" height={150} width={150} />
            </a>

            <IconButton
              sx={{ position: 'absolute', top: 5, right: 5, p: 0 }}
              onClick={() => onDeleteImage(image?.id)}>
              <Delete color="error" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

ImagesUpload.propTypes = {
  images: PropTypes.shape({
    loaded: PropTypes.arrayOf(PropTypes.object),
    uploaded: PropTypes.arrayOf(PropTypes.object),
    deleted: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  onChangeImages: PropTypes.func.isRequired
};
