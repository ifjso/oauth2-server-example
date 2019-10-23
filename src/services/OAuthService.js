import OAuthServer, { Request, Response } from 'oauth2-server';
import Debug from 'debug';

const debug = Debug('OAuthService');

class OAuthService {
  constructor(model) {
    this.oauth = new OAuthServer({ model });
  }

  token = async (req, res) => {
    debug('tokenHandler');
    try {
      const request = new Request(req);
      const response = new Response(res);

      const token = await this.oauth.token(request, response);

      debug('tokenHandler: token %s obtained successfully');

      res.json(token);
    } catch (err) {
      console.error(err);
      res.status(err.code || 500).json(err);
    }
  }

  authenticate = async (req, res, next) => {
    debug('authenticateHandler');
    try {
      const request = new Request(req);
      const response = new Response(res);

      await this.oauth.authenticate(request, response);

      debug('the request was successfully authenticated');

      // next();
    } catch (err) {
      console.error(err);
      res.status(err.code || 500).json(err);
    }
  }

  authorize = async (req, res, next) => {
    debug('authorizeHandler');

    try {
      const request = new Request(req);
      const response = new Response(res);

      const code = await this.oauth.authorize(request, response, {
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

export default OAuthService;
