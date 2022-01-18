const { DataTypes } = require("sequelize");

const sequelize = require("./index");

const Property = require("./property");

const ImageProperty = sequelize.define(
  "ImageProperty",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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

// ImageProperty.belongsTo(Property, {
//   foreignKey: "idProperty",
//   as: "ImagesProperties",
// });

module.exports = ImageProperty;
