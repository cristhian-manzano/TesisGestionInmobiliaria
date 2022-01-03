const router = require('express').Router();

router.get('/login', (req, res) => {
  res.send('Login');
});

router.get('/register', (req, res) => {
  res.send('Register');
});

module.exports = router;
