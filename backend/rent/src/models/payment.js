const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');

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
      allowNull: false
    },

    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    datePaid: {
      type: DataTypes.DATE,
      allowNull: false
    },

    proofOfPayment: {
      type: DataTypes.TEXT,
      allowNull: false
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

module.exports = Payment;
