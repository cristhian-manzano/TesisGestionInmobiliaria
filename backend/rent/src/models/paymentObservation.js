const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Payment = require('./payment');

const PaymentObservation = sequelize.define(
  'PaymentObservation',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    idPayment: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Payment,
        key: 'id'
      }
    },

    idUser: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

PaymentObservation.belongsTo(Payment, {
  foreignKey: 'idPayment',
  as: 'payment'
});

Payment.hasMany(PaymentObservation, {
  foreignKey: 'idPayment',
  as: 'observations'
});

module.exports = PaymentObservation;
