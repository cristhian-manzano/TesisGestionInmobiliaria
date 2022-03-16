const { Op } = require('sequelize');
const moment = require('moment');

const Rent = require('./models/rent');
const Payment = require('./models/payment');
const sequelize = require('./models/index');
const PendingPayment = require('./models/pendingPaymentRent');

const getPaymentsRent = async () =>
  Rent.findAll({
    where: {
      [Op.and]: [
        {
          endDate: {
            [Op.eq]: null
          }
        }
      ]
    },
    include: [
      {
        model: Payment,
        as: 'payments',
        where: {
          validated: true
        },
        required: false,
        attributes: ['id', 'datePaid']
      }
    ]
  });

const setPendingPayments = async () => {
  const payments = await getPaymentsRent();

  const dataToSave = [];

  payments.forEach((paymentRent) => {
    const startDate = new Date(paymentRent.startDate);
    const untilDate = new Date();
    let flagDate = startDate;
    const datesFinal = [];
    while (
      flagDate.getMonth() !== untilDate.getMonth() + 1 ||
      flagDate.getFullYear() !== untilDate.getFullYear()
    ) {
      datesFinal.push(flagDate);

      if (
        flagDate.getMonth() === untilDate.getMonth() &&
        flagDate.getFullYear() === untilDate.getFullYear() &&
        untilDate.getDate() < +paymentRent.paymentDay
      ) {
        datesFinal.pop();
      }
      flagDate = new Date(moment(flagDate).add(1, 'M'));
    }
    const paymentsDates = paymentRent.payments?.map((payment) => new Date(payment.datePaid)) ?? [];

    const pendingDates = datesFinal.filter(
      (date) =>
        !paymentsDates.find(
          (p) => p.getMonth() === date.getMonth() && p.getFullYear() === date.getFullYear()
        )
    );

    pendingDates.forEach((p) => {
      dataToSave.push({
        rent: paymentRent,
        pendingDate: p
      });
    });
  });

  await Promise.all(
    dataToSave.map(async (data) => {
      const month = new Date(data.pendingDate).getMonth() + 1;
      const year = new Date(data.pendingDate).getFullYear();

      const exists = await PendingPayment.findOne({
        where: {
          [Op.and]: [
            sequelize.where(sequelize.literal(`extract(MONTH FROM "pendingDate")`), month),
            sequelize.where(sequelize.literal(`extract(YEAR FROM "pendingDate")`), year),
            { idRent: data.rent.id }
          ]
        }
      });

      if (!exists) {
        await PendingPayment.create({
          pendingDate: data.pendingDate,
          idRent: data.rent.id
        });
      }
    })
  );
};

const job = async () => {
  await setPendingPayments();
};

module.exports = { job };
