const router = require('express').Router();

const { getByFilter, getById, getlistTenants } = require('../controllers/user');

router.post('/tenant/list', getlistTenants);
router.get('/tenant', getByFilter);
router.get('/:id', getById);

module.exports = router;
