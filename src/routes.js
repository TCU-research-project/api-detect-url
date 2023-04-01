import express from 'express';
const router = express.Router();

import urlController from './controllers/url';

router.use('/url', urlController);

export default router;
