//Logger utility to log requests, errors and application flow,
//Winston npm used for logging events
//creates logs folder in root directory, with filename = gas-rush.log

const { createLogger, format, transports } = require("winston");

module.exports = createLogger({
  transports: new transports.File({
    filename: "logs/gas-rush.log",
    format: format.combine(
      format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      format.align(),
      format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
      )
    ),
  }),
});
