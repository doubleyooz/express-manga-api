import express from "express";

import AuthorController from "../controllers/AuthorController.js";

import AuthorMiddleware from "../middlewares/AuthorMiddleware.js";
import UploadMiddleware from "../middlewares/UploadMiddleware.js";

import { auth as Authorize, easyAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post(
	"/",
	Authorize("Scan"),
	UploadMiddleware.upload_many_author,
	AuthorMiddleware.valid_store,
	AuthorController.store
);
router.put(
	"/",
	AuthorMiddleware.valid_update,
	Authorize("Scan"),
	AuthorController.update
);
router.get("/", easyAuth(), AuthorController.list);
router.get("/findOne", easyAuth(), AuthorController.read);
router.delete("/", Authorize("Scan"), AuthorController.remove);

export default router;
