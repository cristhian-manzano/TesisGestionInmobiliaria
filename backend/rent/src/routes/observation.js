const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');
const { getAll, get, create } = require('../controllers/observation');

routes.use(validateToken);

routes.get('/', getAll);
routes.post('/', create);
routes.get('/:id', get);

module.exports = routes;
