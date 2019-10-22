
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
app.use(OAuth2Service.authenticate);

app.get('/', (req, res) => res.send('Congratulations, you are in a secret area!'));

module.exports = app;
