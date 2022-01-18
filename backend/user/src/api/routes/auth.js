const router = require('express').Router();

const { signIn, signUp, getUserByToken } = require('../controllers/auth');

router.post('/signin', signIn);
router.post('/signup', signUp);

// Tokenization
router.post('/token', getUserByToken);

module.exports = router;
