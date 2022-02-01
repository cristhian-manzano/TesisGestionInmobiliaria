const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');

const Observation = sequelize.define(
  'Observation',
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

    solved: {
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

Rent.hasMany(Observation, {
  foreignKey: 'idRent',
  as: 'observations'
});

Observation.belongsTo(Rent, {
  foreignKey: 'idRent',
  as: 'rent'
});

module.exports = Observation;
