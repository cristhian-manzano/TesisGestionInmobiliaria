import { useRef, useState } from 'react';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Delete, Edit, Visibility } from '@mui/icons-material/';
import PropTypes from 'prop-types';

export const TableMoreMenu = ({ onView, onUpdate, onDelete }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVert sx={{ fontSize: 25 }} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={onView}>
          <ListItemIcon>
            <Visibility sx={{ fontSize: 25 }} />
          </ListItemIcon>
          <ListItemText primary="Ver mas" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={onUpdate}>
          <ListItemIcon>
            <Edit sx={{ fontSize: 25 }} />
          </ListItemIcon>
          <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={onDelete}>
          <ListItemIcon>
            <Delete sx={{ fontSize: 25 }} />
          </ListItemIcon>
          <ListItemText primary="Eliminar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
};

TableMoreMenu.propTypes = {
  onView: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
