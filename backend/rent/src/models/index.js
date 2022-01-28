const { Sequelize } = require('sequelize');
const dbConfig = require('../config/dbConfig');

const enviroment = process.env.NODE_ENV || 'development';
const db = dbConfig[enviroment];

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  define: {
    freezeTableName: true
  }
});

module.exports = sequelize;
