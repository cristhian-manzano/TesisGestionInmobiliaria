const routes = require('express').Router();

const { validateToken } = require('../middlewares/authMiddleware');
const { multerMiddleware } = require('../middlewares/multerMiddleware');
const {
  getAll,
  create,
  get,
  destroy,
  validatePayment,
  getIncomeByFilter
} = require('../controllers/payment');

routes.use(validateToken);

routes.get('/income', getIncomeByFilter);

routes.get('/:id', get);
routes.delete('/:id', destroy);
routes.get('/', getAll);
routes.post('/validate/:id', validatePayment);
routes.post('/', multerMiddleware('paymentFile'), create);

module.exports = routes;
