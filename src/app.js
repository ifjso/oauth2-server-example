import express from 'express';
import morgan from 'morgan';
import config from './config';
import { log, stream } from './logger';
import oauth from './oauth2';

const app = express();

app.use(morgan('short', { stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/status', (req, res) => {
  res.status(200).end();
});

app.use(config.api.prefix, oauth);

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  log.error(err.stack);

  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message
    }
  });
});

export default app;
