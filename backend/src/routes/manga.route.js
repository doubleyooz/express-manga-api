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
    MangaMiddleware.valid_store,
    MangaController.store,
);
router.get('/', easyAuth(), MangaMiddleware.valid_list, MangaController.list);
router.get(
    '/findOne',
    easyAuth(),
    MangaMiddleware.valid_findOne,
    MangaController.findOne,
);
router.put(
    '/',
    Authorize('Scan'),
    MangaMiddleware.valid_update,
    MangaController.update,
);
router.delete(
    '/',
    Authorize('Scan'),
    MangaMiddleware.valid_remove,
    MangaController.remove,
);
router.put('/like', Authorize('User'), LikeController.likeManga);
router.put('/pin', Authorize('User'), LikeController.pinManga);

export default router;
