import { Router } from 'express';
import { token, authorize, authenticate } from './oauthController';

const router = Router();

// route.get('/oauth/authorize', OAuthService.authorize); // TODO login page

router.post('/oauth/token', token);
router.post('/oauth/authorize', authorize);
router.get('/oauth/authenticate', authenticate);

export default router;
