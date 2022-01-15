const { addColors, createLogger, format, transports } = require('winston');

const { combine, colorize, printf, timestamp } = format;

// Define your severity levels.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define different colors for each level.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Link the colors defined to the severity levels.
addColors(colors);

// production: show only warn and error messages. Development: show all the log levels
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const customFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  printf((info) => `${info.timestamp} ${info.level}:  ${info.message} `)
);

const Logger = createLogger({
  level: level(),
  levels,
  transports: [
    new transports.Console({ format: combine(customFormat, colorize({ all: true })) }),
    new transports.File({ filename: 'logs/all.log', format: combine(customFormat) }),

    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(customFormat)
    })
  ]
});

module.exports = Logger;
