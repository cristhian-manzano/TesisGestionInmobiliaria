const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');
const ObservationImage = require('./ObservationImage');

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

    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    idRent: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Rent,
        key: 'id'
      }
    },

    idObservationImage: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: ObservationImage,
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

Observation.belongsTo(ObservationImage, {
  as: 'observationImage',
  foreignKey: 'idObservationImage'
});

ObservationImage.hasOne(Observation, {
  as: 'Observation',
  foreignKey: 'idObservationImage'
});

module.exports = Observation;
