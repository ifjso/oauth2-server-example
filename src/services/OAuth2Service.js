
const debug = require('debug')('OAuth2Service');
const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('../models/OAuth2Model');

const { Request, Response } = OAuth2Server;

class OAuth2Service {
  constructor(model) {
    this.oauth2 = new OAuth2Server({ model });
    this.token = this.token.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authorize = this.authorize.bind(this);
  }

  async token(req, res) {
    debug('tokenHandler');
    try {
      const request = new Request(req);
      const response = new Response(res);

      const token = await this.oauth2.token(request, response);

      debug('tokenHandler: token %s obtained successfully');

      res.json(token);
    } catch (err) {
      console.error(err);
      res.status(err.code || 500).json(err);
    }
  }

  async authenticate(req, res, next) {
    debug('authenticateHandler');
    try {
      const request = new Request(req);
      const response = new Response(res);

      await this.oauth2.authenticate(request, response);

      debug('the request was successfully authenticated');

      // next();
    } catch (err) {
      console.error(err);
      res.status(err.code || 500).json(err);
    }
  }

  async authorize(req, res, next) {
    debug('authorizeHandler');

    try {
      const request = new Request(req);
      const response = new Response(res);

      const code = await this.oauth2.authorize(request, response, {
        authenticateHandler: {
          handle: (request, response) => ({ id: '1' })
        }
      });

      debug('the request was successfully authorized');

      res.redirect(`${req.body.redirect_uri}?code=${code.authorizationCode}&state=${req.body.state}`);
    } catch (err) {
      console.error(err);
      res.status(err.code || 500).json(err);
    }
  }
}

module.exports = new OAuth2Service(OAuth2Model);
