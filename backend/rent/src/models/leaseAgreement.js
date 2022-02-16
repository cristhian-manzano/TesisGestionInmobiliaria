const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Rent = require('./rent');
const ContractFile = require('./ContractFile');

const LeaseAgreement = sequelize.define(
  'LeaseAgreement',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    idRent: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Rent,
        key: 'id'
      }
    },
    idContractFile: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: ContractFile,
        key: 'id'
      }
    }
  },
  {
    timestamps: false
  }
);

LeaseAgreement.belongsTo(ContractFile, {
  as: 'contractFile',
  foreignKey: 'idContractFile'
});

ContractFile.hasOne(LeaseAgreement, {
  as: 'LeaseAgrement',
  foreignKey: 'idContractFile'
});

// Rent relationship

LeaseAgreement.belongsTo(Rent, {
  as: 'rent',
  foreignKey: 'idRent'
});

Rent.hasMany(LeaseAgreement, {
  as: 'leases',
  foreignKey: 'idRent'
});

module.exports = LeaseAgreement;
