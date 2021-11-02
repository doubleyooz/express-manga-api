import express from "express";

import LikeController from "../controllers/LikeController.js";
import NotifyController from "../controllers/NotifyController.js";
import UserController from "../controllers/UserController.js";

import UserMiddleware from "../middlewares/UserMiddleware.js";

import { auth as Authorize, easyAuth } from "../middlewares/SessionMiddleware.js";

const router = express.Router();



router.get("/findOne", easyAuth(), UserMiddleware.valid_findOne, UserController.findOne);
router.get("/", easyAuth(), UserMiddleware.valid_list, UserController.list);
router.put(
	"/",
	Authorize(["Scan", "User"]),
	UserMiddleware.valid_update,
	UserController.update
);
router.delete(
	"/",
	Authorize(["Scan", "User"]),
	UserMiddleware.valid_remove,
	UserController.remove
);
router.put("/like", Authorize("User"), LikeController.likeUser);
//router.get('//review',  easyAuth(), MangaMiddleware.valid_review_list, ReviewController.list);
router.get("/notify", Authorize("Scan"), NotifyController.notifyUsers);

export default router;
