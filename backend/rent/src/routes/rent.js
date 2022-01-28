const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');

const { getAll, create, get, destroy } = require('../controllers/rent');

routes.use(validateToken);

routes.get('/', getAll);
routes.get('/:id', get);
routes.post('/', create);
routes.delete('/', destroy);

module.exports = routes;
