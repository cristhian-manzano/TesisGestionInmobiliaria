const router = require('express').Router();

const {
  getByFilter,
  getById,
  updateProfile,
  getListUsers,
  getUsersByAdmin,
  deleteUsersByAdmin,
  updateUsersByAdmin
} = require('../controllers/user');
const { validateToken } = require('../middlewares/auth');

// Admin
router.get('/admin/all', validateToken, getUsersByAdmin);
router.put('/admin/:id', validateToken, updateUsersByAdmin);
router.delete('/admin/:id', validateToken, deleteUsersByAdmin);

// All
router.post('/profile', validateToken, updateProfile);
router.post('/list', getListUsers);
router.get('/tenant', getByFilter);
router.get('/:id', getById);

module.exports = router;
