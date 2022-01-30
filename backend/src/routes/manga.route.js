import express from 'express';

import LikeController from '../controllers/like.controller.js';
import MangaController from '../controllers/manga.controller.js';

import MangaMiddleware from '../middlewares/manga.middleware.js';
import UploadMiddleware from '../middlewares/upload.middleware.js';

import {
    auth as Authorize,
    easyAuth,
} from '../middlewares/session.middleware.js';

const router = express.Router();

router.post(
    '/',
    Authorize('Scan'),
    UploadMiddleware.upload_single,
    MangaMiddleware.store,
    MangaController.store,
);
router.get('/', easyAuth(), MangaMiddleware.list, MangaController.list);
router.get(
    '/findOne',
    easyAuth(),
    MangaMiddleware.findOne,
    MangaController.findOne,
);
router.put(
    '/',
    Authorize('Scan'),
    MangaMiddleware.update,
    MangaController.update,
);
router.delete(
    '/',
    Authorize('Scan'),
    MangaMiddleware.remove,
    MangaController.remove,
);
router.put('/like', Authorize('User'), LikeController.likeManga);
router.put('/pin', Authorize('User'), LikeController.pinManga);

export default router;
