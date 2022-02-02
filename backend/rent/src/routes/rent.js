const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');

const { getAll, create, get, destroy, update } = require('../controllers/rent');

routes.use(validateToken);

routes.get('/', getAll);
routes.get('/:id', get);
routes.post('/', create);
routes.put('/:id', update);
routes.delete('/', destroy);

module.exports = routes;
