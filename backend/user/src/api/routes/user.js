const router = require('express').Router();

const { getByFilter, getById, getlistUsers } = require('../controllers/user');

router.post('/list', getlistUsers);
router.get('/tenant', getByFilter);
router.get('/:id', getById);

module.exports = router;
