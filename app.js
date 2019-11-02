import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { log, stream } from './loader/logger';
import routes from './routes';

const app = express();

app.use(cors());

app.use(morgan('short', { stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/status', (req, res) => {
  res.status(200).end();
});

routes.init(app);

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
