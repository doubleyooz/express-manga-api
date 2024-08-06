import express from "express";

// import LikeController from '../controllers/like.controller.js';
// import NotifyController from '../controllers/notify.controller.js';
import UserController from "../controllers/users.controller.js";

import UserMiddleware from "../middlewares/users.middleware.js";

const router = express.Router();

router.get(
  "/findOne",

  UserMiddleware.findOne,
  UserController.findOne
);
router.get("/", UserMiddleware.list, UserController.list);
router.put("/", UserMiddleware.update, UserController.update);
router.delete("/", UserMiddleware.remove, UserController.remove);
// router.put('/like', Authorize('User'), LikeController.likeUser);
// router.get('//review',  easyAuth(), MangaMiddleware.review_list, ReviewController.list);
// router.get('/notify', Authorize('Scan'), NotifyController.notifyUsers);

export default router;
