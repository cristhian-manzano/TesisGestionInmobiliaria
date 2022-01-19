const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const ImageProperty = sequelize.define(
  "ImageProperty",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    idProperty: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Property",
        key: "id",
      },
    },
  },
  { timestamps: false }
);

module.exports = ImageProperty;
