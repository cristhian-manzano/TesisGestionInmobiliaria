const routes = require('express').Router();

const {
  getAll,
  get,
  getByOwner,
  create,
  update,
  destroy,
  getlistProperties,
  updateStateProperty
} = require('../controllers/property');

// Multer, files
const { multerMiddleware } = require('../middlewares/multerMiddleware');

// Validate by user token
const { validateToken } = require('../middlewares/AuthMiddleare');

// Routes
routes.get('/', getAll);
routes.get('/get-by-owner', validateToken, getByOwner);
routes.post('/', validateToken, multerMiddleware, create);
routes.post('/list', getlistProperties);
routes.get('/:id', get);

routes.put('/:id/availability', updateStateProperty);

routes.put('/:id', validateToken, multerMiddleware, update);
routes.delete('/:id', validateToken, destroy);

module.exports = routes;
