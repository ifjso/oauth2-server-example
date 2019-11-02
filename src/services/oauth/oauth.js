import OAuthServer, { Request, Response } from 'oauth2-server';
import _lang from 'lodash/lang';
import { OAuth, User } from '../../models';
import { log } from '../../loader/logger';

const oauth = new OAuthServer({ model: new OAuth() });

const authorize = async (req, res, next) => {
  try {
    const request = new Request(req);
    const response = new Response(res);

    const code = await oauth.authorize(request, response, {
      authenticateHandler: {
        handle: authenticateHandler
      }
    });

    log.info('Successfully obtained a token.');

    res.redirect(`${req.body.redirect_uri}?code=${code.authorizationCode}&state=${req.body.state}`);
  } catch (err) {
    next(err);
  }
};

const authenticateHandler = async (req) => {
  const { mobileNumber, pin } = req.body;

  const user = await User.findByMobileNumberAndPin(mobileNumber, pin);

  if (_lang.isEmpty(user)) {
    return false;
  }

  return { id: user.userId };
};

const getToken = async (req, res, next) => {
  try {
    const request = new Request(req);
    const response = new Response(res);

    const token = await oauth.token(request, response);

    log.info('Successfully obtained a token.');

    res.json(token);
  } catch (err) {
    next(err);
  }
};

const authenticate = async (req, res, next) => {
  try {
    const request = new Request(req);
    const response = new Response(res);

    const token = await oauth.authenticate(request, response);

    log.info('Successfully authenticated.');

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export { getToken, authorize, authenticate };
