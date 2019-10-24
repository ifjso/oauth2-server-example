import { Router } from 'express';
import OAuthService from '../../services/OAuthService';
import OAuthModel from '../../models/OAuthModel';

const route = Router();
const oauthService = new OAuthService(new OAuthModel());

export default (app) => {
  app.use('/oauth', route);

  // route.get('/oauth/authorize', OAuthService.authorize); // TODO login page
  route.post('/authorize', oauthService.authorize);
  route.post('/token', oauthService.token);
  route.get('/authenticate', oauthService.authenticate);
};
