const routes = require('express').Router();

const { getAll } = require('../controllers/payment');

routes.get('/', getAll);

module.exports = routes;
