const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const TypeProperty = sequelize.define(
  "TypeProperty",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    additionalFeatures: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = TypeProperty;
