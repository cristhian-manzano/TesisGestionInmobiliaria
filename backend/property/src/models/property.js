const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ImageProperty = require('./imageProperty');
const TypeProperty = require('./typeProperty');
const Sector = require('./sector');

const Property = sequelize.define(
  'Property',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    tagName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    area: {
      type: DataTypes.NUMBER({ length: 8, decimals: 2 }),
      allowNull: true
    },

    price: {
      type: DataTypes.NUMBER({ length: 8, decimals: 2 }),
      allowNull: true
    },

    address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },

    available: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },

    additionalFeatures: {
      type: DataTypes.JSONB,
      allowNull: true
    },

    idOwner: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    idTypeProperty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TypeProperty',
        key: 'id'
      }
    },

    idSector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sector',
        key: 'id'
      }
    }
  },
  { timestamps: false }
);

Property.hasMany(ImageProperty, {
  foreignKey: 'idProperty',
  as: 'ImagesProperties'
});

Property.belongsTo(TypeProperty, {
  foreignKey: 'idTypeProperty',
  as: 'typeProperty'
});

Property.belongsTo(Sector, {
  foreignKey: 'idSector',
  as: 'sector'
});

module.exports = Property;
