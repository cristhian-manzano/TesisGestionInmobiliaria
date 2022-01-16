const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserRole = sequelize.define(
  'UserRole',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    idUser: {
      type: DataTypes.BIGINT,
      allowNull: false,

      references: {
        model: 'User',
        key: 'id'
      }
    },

    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'Role',
        key: 'id'
      }
    }
  },
  { timestamps: false }
);

module.exports = UserRole;
