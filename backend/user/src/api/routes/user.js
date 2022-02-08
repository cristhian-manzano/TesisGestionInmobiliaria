const router = require('express').Router();

const {
  getByFilter,
  getById,
  getlistTenants,
  getTenantById,
  getlistUsers
} = require('../controllers/user');

router.post('/list', getlistUsers);
router.post('/tenant/list', getlistTenants);
router.get('/tenant', getByFilter);
router.get('/tenant/:id', getTenantById);
router.get('/:id', getById);

module.exports = router;
