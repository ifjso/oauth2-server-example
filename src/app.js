const express = require('express');
const logger = require('morgan');
const OAuth2Service = require('./services/OAuth2Service.js');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/oauth/token', OAuth2Service.tokenHandler);
app.use(OAuth2Service.authenticateHandler);

app.get('/', (req, res) => res.send('Congratulations, you are in a secret area!'));

module.exports = app;
