const routes = require('express').Router();

const { get } = require('../controllers/typeProperty');

routes.get('/', get);

module.exports = routes;
