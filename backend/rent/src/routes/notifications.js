const routes = require('express').Router();
const { validateToken } = require('../middlewares/authMiddleware');
const { get, updateToRead } = require('../controllers/notifications');

routes.use(validateToken);

routes.get('/', get);
routes.put('/', updateToRead);

module.exports = routes;
