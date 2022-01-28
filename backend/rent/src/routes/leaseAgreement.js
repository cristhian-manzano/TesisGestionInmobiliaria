const routes = require('express').Router();

const { getAll } = require('../controllers/leaseAgreement');

routes.get('/', getAll);

module.exports = routes;
