import { useRef, useState } from 'react';

// material
import { Menu, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material/';
import PropTypes from 'prop-types';

export const TableMoreMenu = ({ children }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVert sx={{ fontSize: 25 }} />
      </IconButton>

      <Menu
        open={isOpen}
        closeAfterTransition
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {children}
      </Menu>
    </>
  );
};

TableMoreMenu.propTypes = {
  children: PropTypes.node.isRequired
};
