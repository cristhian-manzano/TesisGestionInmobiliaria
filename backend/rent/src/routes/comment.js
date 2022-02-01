const routes = require('express').Router();

const { validateToken } = require('../middlewares/authMiddleware');
const { getAll, create, destroy } = require('../controllers/comment');

routes.use(validateToken);

routes.post('/', create);
routes.get('/:id', getAll);
routes.delete('/:id', destroy);

module.exports = routes;
