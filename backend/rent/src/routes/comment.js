const routes = require('express').Router();

const { getAll } = require('../controllers/comment');

routes.get('/', getAll);

module.exports = routes;
