const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Rent = sequelize.define(
  'Rent',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    securityDeposit: {
      type: DataTypes.NUMBER({ length: 8, decimals: 2 }),
      allowNull: true
    },
    paymentDay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idProperty: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    idTenant: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

module.exports = Rent;
