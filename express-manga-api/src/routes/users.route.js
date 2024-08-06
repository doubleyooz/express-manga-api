import express from "express";

// import LikeController from '../controllers/like.controller.js';
// import NotifyController from '../controllers/notify.controller.js';
import userController from "../controllers/users.controller.js";

import userMiddleware from "../middlewares/users.middleware.js";

const router = express.Router();

router.post("/", userMiddleware.create, userController.create);
router.get("/:userId", userMiddleware.findOneById, userController.findOne);
router.get("/", userMiddleware.find, userController.find);
router.put("/", userMiddleware.update, userController.update);
router.delete("/", userController.remove);
// router.put('/like', Authorize('User'), LikeController.likeUser);
// router.get('//review',  easyAuth(), MangaMiddleware.review_list, ReviewController.list);
// router.get('/notify', Authorize('Scan'), NotifyController.notifyUsers);

export default router;
