const routes = require('express').Router();

const { getAll } = require('../controllers/observation');

routes.get('/', getAll);

module.exports = routes;
