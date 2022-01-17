const router = require('express').Router();

// Routes
const auth = require('./auth');
const role = require('./role');

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.use('/auth', auth);
router.use('/role', role);

module.exports = router;