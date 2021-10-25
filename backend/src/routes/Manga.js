import express from "express";

import LikeController from "../controllers/LikeController.js";
import MangaController from "../controllers/MangaController.js";

import MangaMiddleware from "../middlewares/MangaMiddleware.js";
import UploadMiddleware from "../middlewares/UploadMiddleware.js";

import { auth as Authorize, easyAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post(
	"/",
	Authorize("Scan"),
	UploadMiddleware.upload_single,
	MangaMiddleware.valid_store,
	MangaController.store
);
router.get(
	"/list",
	easyAuth(),
	MangaMiddleware.valid_list,
	MangaController.list
);
router.get(
	"/read",
	easyAuth(),
	MangaMiddleware.valid_read,
	MangaController.read
);
router.put(
	"/",
	Authorize("Scan"),
	MangaMiddleware.valid_update,
	MangaController.update
);
router.delete(
	"/",
	Authorize("Scan"),
	MangaMiddleware.valid_remove,
	MangaController.remove
);
router.put("/like", Authorize("User"), LikeController.likeManga);
router.put("/pin", Authorize("User"), LikeController.pinManga);

export default router;