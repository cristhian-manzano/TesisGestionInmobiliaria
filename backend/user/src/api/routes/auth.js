const router = require('express').Router();

const {
  signIn,
  signUp,
  getUserByToken,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Tokenization
router.post('/token', getUserByToken);

module.exports = router;
