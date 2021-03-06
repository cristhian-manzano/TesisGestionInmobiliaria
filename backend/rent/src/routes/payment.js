const routes = require('express').Router();

const { validateToken } = require('../middlewares/authMiddleware');
const { multerMiddleware } = require('../middlewares/multerMiddleware');
const {
  getAll,
  create,
  get,
  destroy,
  validatePayment,
  getIncomeByFilter,
  getPendingRents,
  addObservationPayment,
  deleteObservationPayment,
  getPendingPayment
} = require('../controllers/payment');

routes.use(validateToken);

routes.get('/income', getIncomeByFilter);

routes.get('/pending', getPendingRents);

routes.get('/:id', get);
routes.delete('/:id', destroy);
routes.get('/', getAll);
routes.post('/validate/:id', validatePayment);
routes.post('/', multerMiddleware('paymentFile'), create);

routes.post('/pending', getPendingPayment);

routes.post('/observation', addObservationPayment);
routes.delete('/observation/:id', deleteObservationPayment);

module.exports = routes;
