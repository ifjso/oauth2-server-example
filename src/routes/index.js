import apiRoute from './apis';
import env from '../configs/env';

const init = (app) => {
  app.use(env.api.prefix, apiRoute);
};

export default { init };
