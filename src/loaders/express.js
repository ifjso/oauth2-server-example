import express from 'express';
import config from '../config';
import routes from '../api';

export default (app) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(config.api.prefix, routes());

  app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message
      }
    });
  });
};
