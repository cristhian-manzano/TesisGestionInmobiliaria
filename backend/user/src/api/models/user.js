const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(75),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  idCard: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  idRole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Role',
      key: 'id'
    }
  }
});

module.exports = User;
