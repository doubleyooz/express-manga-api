import express from 'express';

import ReviewController from '../controllers/review.controller.js';

import ReviewMiddleware from '../middlewares/review.middleware.js';

import {
    auth as Authorize,
    easyAuth,
} from '../middlewares/session.middleware.js';

const router = express.Router();

router.post(
    '/',
    Authorize('User'),
    ReviewMiddleware.valid_store,
    ReviewController.store,
);
router.get('/', easyAuth(), ReviewMiddleware.valid_list, ReviewController.list);
router.get(
    '/findOne',
    easyAuth(),
    ReviewMiddleware.valid_findOne,
    ReviewController.findOne,
);
router.put(
    '/',
    Authorize('User'),
    ReviewMiddleware.valid_update,
    ReviewController.update,
);
router.delete(
    '/',
    Authorize('User'),
    ReviewMiddleware.valid_remove,
    ReviewController.remove,
);

export default router;
