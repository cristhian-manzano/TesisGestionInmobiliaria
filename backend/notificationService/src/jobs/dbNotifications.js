const { Op } = require("sequelize");
const moment = require("moment");
const { default: axios } = require("axios");

const Rent = require("../models/rent");
const Payment = require("../models/payment");
const LeaseAgreement = require("../models/leaseAgreement");
const Notification = require("../models/notification");
const sequelize = require("../models/index");
const PendingPayment = require("../models/pendingPaymentRent");
const Logger = require("../config/logger");

const getPaymentsRent = async () =>
  Rent.findAll({
    where: {
      [Op.and]: [
        {
          endDate: {
            [Op.eq]: null,
          },
        },
      ],
    },
    include: [
      {
        model: Payment,
        as: "payments",
        where: {
          validated: true,
        },
        required: false,
        attributes: ["id", "datePaid"],
      },
    ],
  });

const pendingPaymentNotification = async (data = {}) => {
  const userData = await axios.post(`${process.env.API_USER_URL}/user/list`, {
    users: [data.rent?.idTenant],
  });

  const property = await axios.post(
    `${process.env.API_PROPERTY_URL}/property/list`,
    {
      properties: [data.rent?.idProperty],
    }
  );

  const receiverId = data.rent?.idOwner;

  // Create for owner
  await Notification.create({
    description: `${userData.data.data[0].firstName?.split(" ")[0]} ${
      userData.data.data[0].lastName?.split(" ")[0]
    } tiene un pago pendiente del mes ${
      data.pendingDate.getMonth() + 1
    }/${data.pendingDate.getFullYear()}.`,
    entity: "PendingPayment",
    idEntity: data.rent?.id,
    idSender: data.rent.idTenant,
    idReceiver: receiverId,
  }).catch((e) => {
    Logger.error(e);
  });

  // Create for tenant
  await Notification.create({
    description: `Tiene un pago pendiente del mes ${
      data.pendingDate.getMonth() + 1
    }/${data.pendingDate.getFullYear()} en la propiedad '${
      property.data.data[0]?.tagName
    }'.`,
    entity: "PendingPayment",
    idEntity: data.rent?.id,
    idSender: receiverId,
    idReceiver: data.rent?.idTenant,
  }).catch((e) => {
    Logger.error(e);
  });
};

const setPendingPayments = async () => {
  const payments = await getPaymentsRent();

  console.log(JSON.stringify(payments, null, 4));

  const dataToSave = [];

  payments.forEach((paymentRent) => {
    const startDate = new Date(paymentRent.startDate);
    const untilDate = new Date();
    let flagDate = startDate;
    const datesFinal = [];
    while (flagDate.getFullYear() <= untilDate.getFullYear()) {
      if (
        flagDate.getFullYear() === untilDate.getFullYear() &&
        flagDate.getMonth() > untilDate.getMonth()
      )
        break;

      datesFinal.push(flagDate);

      if (
        flagDate.getMonth() === untilDate.getMonth() &&
        flagDate.getFullYear() === untilDate.getFullYear() &&
        untilDate.getDate() < +paymentRent.paymentDay
      ) {
        datesFinal.pop();
      }
      flagDate = new Date(moment(flagDate).add(1, "M"));
    }
    const paymentsDates =
      paymentRent.payments?.map((payment) => new Date(payment.datePaid)) ?? [];

    const pendingDates = datesFinal.filter(
      (date) =>
        !paymentsDates.find(
          (p) =>
            p.getMonth() === date.getMonth() &&
            p.getFullYear() === date.getFullYear()
        )
    );

    pendingDates.forEach((p) => {
      dataToSave.push({
        rent: paymentRent,
        pendingDate: p,
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
            sequelize.where(
              sequelize.literal(`extract(MONTH FROM "pendingDate")`),
              month
            ),
            sequelize.where(
              sequelize.literal(`extract(YEAR FROM "pendingDate")`),
              year
            ),
            { idRent: data.rent.id },
          ],
        },
      });

      if (!exists) {
        const property = await axios.post(
          `${process.env.API_PROPERTY_URL}/property/list`,
          { properties: [data.rent?.idProperty] }
        );

        await PendingPayment.create({
          pendingDate: data.pendingDate,
          idRent: data.rent.id,
          amount: property.data.data[0]?.price ?? null,
        });

        // Create notification
        await pendingPaymentNotification(data);
      }
    })
  );
};

const finishContracts = async () => {
  const Leases = await LeaseAgreement.findAll({
    where: {
      active: true,
      endDate: {
        [Op.lte]: new Date(),
      },
    },
    include: [
      {
        model: Rent,
        as: "rent",
      },
    ],
  });

  await Promise.all(
    Leases.map(async (lease) => {
      await lease.update({ active: false });

      const property = await axios.post(
        `${process.env.API_PROPERTY_URL}/property/list`,
        {
          properties: [lease.rent?.idProperty],
        }
      );

      // Create for tenant
      await Notification.create({
        description: `El contrato de la propiedad '${property.data.data[0]?.tagName}' ha caducado.`,
        entity: "FinishContract",
        idEntity: lease.id,
        idSender: lease.rent?.idOwner,
        idReceiver: lease.rent?.idTenant,
      }).catch((e) => {
        Logger.error(e);
      });

      // Create for owner
      await Notification.create({
        description: `El contrato de la propiedad '${property.data.data[0]?.tagName}' ha caducado.`,
        entity: "FinishContract",
        idEntity: lease.id,
        idSender: lease.rent?.idTenant,
        idReceiver: lease.rent?.idOwner,
      }).catch((e) => {
        Logger.error(e);
      });
    })
  );
};

const job = async () => {
  await setPendingPayments().catch((e) => {
    Logger.error(e);
  });

  await finishContracts().catch((e) => {
    Logger.error(e);
  });
};

module.exports = { job };
