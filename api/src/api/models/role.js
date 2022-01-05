const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Role;
