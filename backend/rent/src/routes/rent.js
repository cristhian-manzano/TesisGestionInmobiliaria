const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');

const {
  getAll,
  create,
  get,
  destroy,
  update,
  getAllByTenant,
  finishRent
} = require('../controllers/rent');

routes.use(validateToken);

routes.get('/tenant', getAllByTenant);
routes.get('/', getAll);
routes.get('/:id', get);
routes.post('/', create);
routes.put('/:id', update);
routes.put('/finish/:id', finishRent);
routes.delete('/:id', destroy);

module.exports = routes;
