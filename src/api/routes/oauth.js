import { Router } from 'express';
import OAuthService from '../../services/OAuthService';
import OAuthModel from '../../models/OAuthModel';

const route = Router();
const oauthService = new OAuthService(new OAuthModel());

export default (app) => {
  app.use('/oauth', route);

  // route.get('/oauth/authorize', OAuthService.authorize); // TODO login page
  route.post('/oauth/authorize', oauthService.authorize);
  route.post('/oauth/token', oauthService.token);

  // route.get('/oauth/authorize', OAuthService.authorize);
  // route.use(OAuthService.authenticate);
};
