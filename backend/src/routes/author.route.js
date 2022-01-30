import express from 'express';

import AuthorController from '../controllers/author.controller.js';

import AuthorMiddleware from '../middlewares/author.middleware.js';
import UploadMiddleware from '../middlewares/upload.middleware.js';

import {
    auth as Authorize,
    easyAuth,
} from '../middlewares/session.middleware.js';

const router = express.Router();

router.post(
    '/',
    Authorize('Scan'),
    UploadMiddleware.upload_many_author,
    AuthorMiddleware.store,
    AuthorController.store,
);
router.put(
    '/',
    AuthorMiddleware.update,
    Authorize('Scan'),
    AuthorController.update,
);
router.get('/', easyAuth(), AuthorMiddleware.list, AuthorController.list);
router.get(
    '/findOne',
    easyAuth(),
    AuthorMiddleware.findById,
    AuthorController.findOne,
);
router.delete(
    '/',
    Authorize('Scan'),
    AuthorMiddleware.findById,
    AuthorController.remove,
);

export default router;
