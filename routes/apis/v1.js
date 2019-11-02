import { Router } from 'express';
import oauthController from '../../controllers/apis/oauth';

const router = Router();

router.use('/oauth', oauthController);

export default router;
