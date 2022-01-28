module.exports = {
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres'
  },
  development: {
    username: 'rent-admin',
    password: '12345.',
    database: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  }
};
