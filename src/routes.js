import express from 'express';
const router = express.Router();

import urlController from './controllers/url';
import articleController from './controllers/article';

router.use('/url', urlController);
router.use('/article', articleController);

export default router;
