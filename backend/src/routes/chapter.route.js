import express from 'express';
import multer from 'multer';

import ChapterController from '../controllers/chapter.controller.js';

import ChapterMiddleware from '../middlewares/chapter.middleware.js';
import multerConfig from '../config/multer.config.js';

import {
    auth as Authorize,
    easyAuth,
} from '../middlewares/session.middleware.js';

const router = express.Router();

const upload = multer(multerConfig.covers).array('imgCollection');

router.post(
    '/',
    Authorize('Scan'),
    upload,
    ChapterMiddleware.valid_store,
    ChapterController.store,
);
router.get(
    '/',
    easyAuth(),
    ChapterMiddleware.valid_list,
    ChapterController.list,
);
router.get(
    '/findOne',
    easyAuth(),
    ChapterMiddleware.valid_findOne,
    ChapterController.findOne,
);
router.put(
    '/',
    Authorize('Scan'),
    upload,
    ChapterMiddleware.valid_update,
    ChapterController.update,
);
router.delete(
    '/',
    Authorize('Scan'),
    ChapterMiddleware.valid_remove,
    ChapterController.remove,
);

export default router;
