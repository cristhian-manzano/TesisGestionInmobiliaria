const routes = require('express').Router();

// Import routes

// Example
routes.get('/hello', (req, res) => res.json({ message: 'Hello world!' }));

module.exports = routes;
