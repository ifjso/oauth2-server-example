import crypto from 'crypto';
import OAuthServer, { Request, Response } from 'oauth2-server';
import OAuth from './OAuth';
import DDRUser from '../ddr/DDRUser';
import DaylipassUser from '../daylipass/DaylipassUser';
import { log } from '../logger';

const oauth = new OAuthServer({ model: new OAuth() });

const token = async (req, res, next) => {
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
  const daylipassUser = await DaylipassUser.findByMobileNumber(mobileNumber);
  const ddrUser = await DDRUser.findByDaylipassIdAndPin(daylipassUser.get('user_id'), pin);
  return ddrUser;
};

const authenticate = async (req, res, next) => {
  try {
    const request = new Request(req);
    const response = new Response(res);

    const token = await oauth.authenticate(request, response);

    log.info('Successfully authenticated.');

    res.json(token);
  } catch (err) {
    next(err);
  }
};

export { token, authorize, authenticate };
