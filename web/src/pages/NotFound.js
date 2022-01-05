import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div>
      <h1>Página no encontrada</h1>
      <Link to="/">Regresar a la página de inicio</Link>
    </div>
  );
};
