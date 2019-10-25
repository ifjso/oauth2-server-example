import httpLoggerLoader from './http-logger';
import expressLoader from './express';

export default (app) => {
  httpLoggerLoader(app);
  expressLoader(app);
};
