const debug = require('debug')('OAuth2Service');
const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('../models/OAuth2Model');

const { Request, Response } = OAuth2Server;

class OAuth2Service {
  constructor(model) {
    this.oauth2 = new OAuth2Server({ model });
    this.tokenHandler = this.tokenHandler.bind(this);
    this.authenticateHandler = this.authenticateHandler.bind(this);
    this.authorizeHandler = this.authorizeHandler.bind(this);
  }

  async tokenHandler(req, res) {
    try {
      const request = new Request(req);
      const response = new Response(res);
      const token = await this.oauth2.token(request, response);

      debug('tokenHandler: token %s obtained successfully');

      res.json(token);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  async authenticateHandler(req, res, next) {
    try {
      const request = new Request(req);
      const response = new Response(res);
      await this.oauth2.authenticate(request, response);

      debug('the request was successfully authenticated');

      next();
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  async authorizeHandler(req, res, next) {
    try {
      const request = new Request(req);
      const response = new Response(res);
      await this.oauth2.authorize(request, response);

      debug('the request was successfully authorized');

      next();
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }
}

module.exports = new OAuth2Service(OAuth2Model);
