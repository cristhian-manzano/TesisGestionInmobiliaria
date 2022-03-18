const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');

const PendingPayment = sequelize.define(
  'PendingPayment',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    pendingDate: {
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

PendingPayment.belongsTo(Rent, {
  as: 'rent',
  foreignKey: 'idRent'
});

Rent.hasMany(PendingPayment, {
  as: 'pendingPayments',
  foreignKey: 'idRent'
});

module.exports = PendingPayment;
