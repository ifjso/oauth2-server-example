import config from 'config';
import apiRoute from './apis';

const init = (app) => {
  app.use(config.get('basePath'), apiRoute);
};

export default { init };
