const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');
const { getAll, get, destroy, create } = require('../controllers/leaseAgreement');

const { multerMiddleware } = require('../middlewares/multerMiddleware');

routes.use(validateToken);

routes.get('/', getAll);
routes.post('/', multerMiddleware('contractFile'), create);
routes.get('/:id', get);
routes.delete('/:id', destroy);

module.exports = routes;
