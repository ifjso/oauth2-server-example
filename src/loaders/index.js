import expressLoader from './express';
import loggerLoader from './logger';

export default ({ app }) => {
  loggerLoader(app);
  expressLoader(app);
};
