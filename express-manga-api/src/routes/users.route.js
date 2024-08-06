import express from "express";

// import LikeController from '../controllers/like.controller.js';
// import NotifyController from '../controllers/notify.controller.js';
import UserController from "../controllers/users.controller.js";

import UserMiddleware from "../middlewares/users.middleware.js";

const router = express.Router();

router.post("/", UserMiddleware.create, UserController.create);
router.get("/:userId", UserMiddleware.findOneById, UserController.findOne);
router.get("/", UserMiddleware.find, UserController.find);
router.put("/", UserMiddleware.update, UserController.update);
router.delete("/", UserController.remove);
// router.put('/like', Authorize('User'), LikeController.likeUser);
// router.get('//review',  easyAuth(), MangaMiddleware.review_list, ReviewController.list);
// router.get('/notify', Authorize('Scan'), NotifyController.notifyUsers);

export default router;
