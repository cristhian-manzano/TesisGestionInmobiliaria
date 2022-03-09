const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    entity: {
      type: DataTypes.STRING(75),
      allowNull: false
    },

    description: {
      type: DataTypes.STRING(75),
      allowNull: false
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },

    idEntity: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    idSender: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    idReceiver: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

module.exports = Notification;
