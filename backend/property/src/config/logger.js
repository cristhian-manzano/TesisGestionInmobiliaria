const winston = require("winston");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define different colors for each level.
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// production: show only warn and error messages. Development: show all the log levels
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}:  ${info.message} `
  )
);

const Logger = winston.createLogger({
  level: level(),
  levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        customFormat,
        winston.format.colorize({ all: true })
      ),
    }),

    new winston.transports.File({
      filename: "logs/all.log",
      format: winston.format.combine(customFormat),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.combine(customFormat),
    }),
  ],
});

module.exports = Logger;
