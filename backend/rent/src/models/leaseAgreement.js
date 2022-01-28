const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');

const LeaseAgreement = sequelize.define(
  'LeaseAgreement',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    file: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    active: {
      type: DataTypes.BOOLEAN,
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

module.exports = LeaseAgreement;
