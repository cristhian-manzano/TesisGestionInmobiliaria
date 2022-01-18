const { Sequelize } = require("sequelize");

const dbConfig = require("../config/dbConfig");

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    define: {
      freezeTableName: true,
    },
  }
);

module.exports = sequelize;
