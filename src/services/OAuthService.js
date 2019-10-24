import OAuthServer, { Request, Response } from 'oauth2-server';
import debug from 'debug';

const log = debug('OAuthService:log');

class OAuthService {
  constructor(model) {
    this.oauth = new OAuthServer({ model });
  }

  token = async (req, res, next) => {
    try {
      const request = new Request(req);
      const response = new Response(res);

      const token = await this.oauth.token(request, response);

      log('Successfully obtained a token.');

      res.json(token);
    } catch (err) {
      next(err);
    }
  }

  authenticate = async (req, res, next) => {
    try {
      const request = new Request(req);
      const response = new Response(res);

      const token = await this.oauth.authenticate(request, response);

      log('Successfully authenticated.');

      res.json(token);
    } catch (err) {
      next(err);
    }
  }

  authorize = async (req, res, next) => {
    try {
      const request = new Request(req);
      const response = new Response(res);

      const code = await this.oauth.authorize(request, response, {
        authenticateHandler: {
          handle: (request, response) => ({ id: '1' })
        }
      });

      log('Successfully authorized.');

      res.redirect(`${req.body.redirect_uri}?code=${code.authorizationCode}&state=${req.body.state}`);
    } catch (err) {
      next(err);
    }
  }
}

export default OAuthService;
