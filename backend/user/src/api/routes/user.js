const router = require('express').Router();

const { getByFilter, getById, getlistTenants, getTenantById } = require('../controllers/user');

router.post('/tenant/list', getlistTenants);
router.get('/tenant', getByFilter);
router.get('/tenant/:id', getTenantById);
router.get('/:id', getById);

module.exports = router;
