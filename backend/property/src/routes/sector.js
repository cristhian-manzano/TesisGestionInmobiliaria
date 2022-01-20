const routes = require('express').Router();

const { get } = require('../controllers/sector');

routes.get('/', get);

module.exports = routes;
