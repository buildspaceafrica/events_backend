const winston = require("winston");

const options = {
  error: {
    level: "error",
    filename: `logs/error.log`,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
};

const logger = winston.createLogger({
  transports: [
    // - Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File(options.error),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== "production") {
  const formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.splat(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...meta } = info;

      return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
      }`;
    })
  );

  logger.add(
    new winston.transports.Console({
      format: formatter,
    })
  );
}

module.exports = logger;
