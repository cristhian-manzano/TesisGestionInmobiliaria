const routes = require('express').Router();

// Import routes
const rentRoutes = require('./rent');

// Example
routes.use('/rent', rentRoutes);

module.exports = routes;
