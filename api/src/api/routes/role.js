const express = require('express');
const { getAll } = require('../controllers/role');

const route = express.Router();

route.get('/', getAll);

module.exports = route;
