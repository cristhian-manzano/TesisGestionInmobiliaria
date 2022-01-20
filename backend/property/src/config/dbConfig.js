require('dotenv').config();

module.exports = {
  development: {
    username: 'tesis-dev',
    password: 'postgres123',
    database: 'postgres',
    host: '143.198.230.162',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'postgres'
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres'
  }
};
