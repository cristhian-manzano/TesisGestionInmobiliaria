const router = require('express').Router();

const { getByFilter, getById } = require('../controllers/user');

router.get('/:id', getById);
router.get('/', getByFilter);

module.exports = router;
