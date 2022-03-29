const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');
const { getAll, get, create, update, destroy } = require('../controllers/observation');

const { multerMiddleware } = require('../middlewares/multerMiddleware');

routes.use(validateToken);

routes.get('/', getAll);
routes.post('/', multerMiddleware('observationImage'), create);
routes.get('/:id', get);
routes.put('/:id', update);
routes.delete('/:id', destroy);

module.exports = routes;
