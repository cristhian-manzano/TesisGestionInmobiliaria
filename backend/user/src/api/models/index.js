const { Sequelize } = require('sequelize');
const dbconfig = require('../../config/db');

const env = process.env.NODE_ENV || 'development';
const db = dbconfig[env];

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
  define: {
    freezeTableName: true
  }
  // logging: false
});

module.exports = sequelize;
