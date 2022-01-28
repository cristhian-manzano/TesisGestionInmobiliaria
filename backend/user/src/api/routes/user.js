const router = require('express').Router();

const { getByFilter, getById, getlistTenants } = require('../controllers/user');

router.get('/:id', getById);
router.get('/tenant', getByFilter);
router.post('/tenant/list', getlistTenants);

module.exports = router;
