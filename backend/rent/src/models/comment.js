const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Observation = require('./observation');

const Comment = sequelize.define(
  'Comment',
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

    idObservation: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Observation,
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

Comment.belongsTo(Observation, {
  foreignKey: 'idObservation',
  as: 'observation'
});

Observation.hasMany(Comment, {
  foreignKey: 'idObservation',
  as: 'comments'
});

module.exports = Comment;
