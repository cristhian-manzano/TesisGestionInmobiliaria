import { useParams, Link as RouterLink } from 'react-router-dom';

import { Typography, Button, Box, Card } from '@mui/material';

import { ArrowBack } from '@mui/icons-material';

export const Update = () => {
  const { id } = useParams();

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

      <Card sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Updating {id}
        </Typography>
      </Card>
    </Box>
  );
};
