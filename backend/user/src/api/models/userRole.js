const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// Imports
const User = require('./user');
const Role = require('./role');

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

Role.belongsToMany(User, { through: UserRole, as: 'users', foreignKey: 'idRole' });
User.belongsToMany(Role, { through: UserRole, as: 'roles', foreignKey: 'idUser' });

module.exports = UserRole;
