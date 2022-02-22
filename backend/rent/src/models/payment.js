const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');
const PaymentFile = require('./PaymentFile');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    code: {
      type: DataTypes.STRING(75),
      allowNull: true
    },

    amount: {
      type: DataTypes.NUMBER({ length: 8, decimals: 2 }),
      allowNull: true
    },

    validated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    datePaid: {
      type: DataTypes.DATE,
      allowNull: false
    },

    idPaymentFile: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: PaymentFile,
        key: 'id'
      }
    },

    dateRegister: {
      type: DataTypes.DATE,
      allowNull: false
    },

    idRent: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Rent,
        key: 'id'
      }
    }
  },
  {
    timestamps: false
  }
);

Payment.belongsTo(PaymentFile, {
  as: 'paymentFile',
  foreignKey: 'idPaymentFile'
});

PaymentFile.hasOne(Payment, {
  as: 'payment',
  foreignKey: 'idPaymentFile'
});

Payment.belongsTo(Rent, {
  as: 'rent',
  foreignKey: 'idRent'
});

Rent.hasMany(Payment, {
  as: 'payments',
  foreignKey: 'idRent'
});

module.exports = Payment;
