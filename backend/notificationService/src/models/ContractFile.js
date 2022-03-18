const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ContractFile = sequelize.define(
  'ContractFile',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    url: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  { timestamps: false }
);

module.exports = ContractFile;
