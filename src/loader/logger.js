import winston, { format } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import config from 'config';

const {
  combine, timestamp, colorize, splat, printf
} = format;

const logFormat = printf(({ timestamp, level, message }) =>
  `${timestamp} [${level}]: ${message}`);

const logOptions = {
  file: {
    filename: `${config.get('logPath')}/oauth_%DATE%.log`,
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

const log = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    splat(),
    logFormat),
  transports: [
    new WinstonDaily({
      ...logOptions.file,
      level: 'error',
      filename: `${config.get('logPath')}/error-oauth_%DATE%.log`
    }),
    new WinstonDaily(logOptions.file)
  ],
  exceptionHandlers: [
    new WinstonDaily({
      ...logOptions.file,
      filename: `${config.get('logPath')}/exception-oauth_%DATE%.log`
    })
  ],
  humanReadableUnhandledException: true,
  exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console(logOptions.console));
}

const stream = {
  write: (message) => log.info(message)
};

export { log, stream };
