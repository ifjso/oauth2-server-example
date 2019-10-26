import winston, { format } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import config from '../config';

const {
  combine, timestamp, colorize, splat, printf
} = format;

const logFormat = printf(({ timestamp, level, message }) =>
  `${timestamp} [${level}]: ${message}`);

const logOptions = {
  file: {
    filename: `${config.log.path}/oauth_%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '7d'
  },

  console: {
    level: 'debug',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      splat(),
      colorize(),
      logFormat)
  }
};

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    splat(),
    logFormat),
  transports: [
    new WinstonDaily({
      ...logOptions.file,
      level: 'error',
      filename: `${config.log.path}/error-oauth_%DATE%.log`
    }),
    new WinstonDaily(logOptions.file)
  ],
  exceptionHandlers: [
    new WinstonDaily({
      ...logOptions.file,
      filename: `${config.log.path}/exception-oauth_%DATE%.log`
    })
  ],
  humanReadableUnhandledException: true,
  exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(logOptions.console));
}

export default logger;
