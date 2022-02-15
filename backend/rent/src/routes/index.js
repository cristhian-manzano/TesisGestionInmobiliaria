const routes = require('express').Router();

// Import routes
const rentRoutes = require('./rent');
const observationRoutes = require('./observation');
const commentRoutes = require('./comment');
const leaseAgreementRoutes = require('./leaseAgreement');
// const paymentRoutes = require('./payment');

// Example
routes.use('/rent', rentRoutes);
routes.use('/comment', commentRoutes);
routes.use('/observation', observationRoutes);
routes.use('/contracts', leaseAgreementRoutes);
// routes.use('/payment', paymentRoutes);

module.exports = routes;
