import { Router } from 'express';
import oauth from './routes/oauth';

export default () => {
  const app = Router();
  oauth(app);

  return app;
};
