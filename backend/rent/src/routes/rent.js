const routes = require('express').Router();

const { getAll, create, get, destroy } = require('../controllers/rent');

routes.get('/', getAll);
routes.get('/:id', get);
routes.post('/', create);
routes.delete('/', destroy);

module.exports = routes;
