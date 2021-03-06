const routes = require('express').Router();

const { validateToken } = require('../middlewares/authMiddleware');
const { getByObservation, create, destroy } = require('../controllers/comment');

routes.use(validateToken);

routes.post('/', create);
routes.get('/:id', getByObservation);
routes.delete('/:id', destroy);

module.exports = routes;
