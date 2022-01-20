const morgan = require('morgan');
const Logger = require('./logger');

const morganMiddleware = morgan('tiny', {
  stream: {
    write: (message) => Logger.http(message)
  },

  skip: () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
  }
});

module.exports = morganMiddleware;
