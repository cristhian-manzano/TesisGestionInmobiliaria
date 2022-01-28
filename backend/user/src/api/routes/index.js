const router = require('express').Router();

// Routes
const auth = require('./auth');
const role = require('./role');
const user = require('./user');

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.use('/auth', auth);
router.use('/role', role);
router.use('/user', user);

module.exports = router;
