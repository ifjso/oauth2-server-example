
const express = require('express');
const logger = require('morgan');
const OAuth2Service = require('./services/OAuth2Service.js');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/oauth/authorize', OAuth2Service.authorize); // TODO login page
app.post('/oauth/authorize', OAuth2Service.authorize);
app.post('/oauth/token', OAuth2Service.token);

// app.get('/oauth/authorize', OAuth2Service.authorize);
// app.use(OAuth2Service.authenticate);

app.get('/', (req, res) => res.send('Congratulations, you are in a secret area!'));

// app.use((req, res, next) => {
//   const err = new Error('Not found');
//   err.status = 404;
//   next(err);
// });

// app.use((err, req, res) => {
//   res.locals.message = err.message;
//   res.locals.error = err;
//   res.status(err.status || 500);
//   console.log('use');
//   res.json(err);
// });

module.exports = app;
