const path = require('path');
const winston = require('winston');

const mkpath = require('./mkpath');

const configuration = require('feathers-configuration');

// retrieves configs based on NODE_ENV
const config = configuration()()['logger'];
const {level, maxFileSize, logFolder} = config;
const env = process.env.NODE_ENV;

require('winston-daily-rotate-file');

let logger = new (winston.Logger)({
  exitOnError: false
});

/* props description [here](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport) */
logger.add(winston.transports.Console, {
  level,
  timestamp: true,
  colorize: true,
  handleExceptions: true,
  humanReadableUnhandledException: true,
  prettyPrint: false
});

if (logFolder) {
  logger.info(`Requested logFolder=${logFolder}`);
  try {
    let logPath = mkpath(path.resolve(logFolder));
    logger.add(winston.transports.DailyRotateFile, {
      level,
      filename: path.join(logPath, `/__${env}.log`),
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      handleExceptions: true,
      zippedArchive: true,
      maxsize: maxFileSize
    });
  } catch (err) {
    logger.error(err);
  }
}

module.exports = logger;
