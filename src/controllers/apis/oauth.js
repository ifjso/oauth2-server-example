import { Router } from 'express';
import { authorize, getToken, authenticate } from '../../services/oauth/oauth';

const router = Router();

router.post('/authorize', authorize);
router.post('/token', getToken);
router.get('/authenticate', authenticate);

export default router;
