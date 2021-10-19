import express from "express";

import ReviewController from "../controllers/ReviewController.js";

import ReviewMiddleware from "../middlewares/ReviewMiddleware.js";

import { auth as Authorize, easyAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post(
	"/",
	Authorize("User"),
	ReviewMiddleware.valid_store,
	ReviewController.store
);
router.get(
	"/list",
	easyAuth(),
	ReviewMiddleware.valid_list,
	ReviewController.list
);
router.get(
	"/read",
	easyAuth(),
	ReviewMiddleware.valid_read,
	ReviewController.read
);
router.put(
	"/",
	Authorize("User"),
	ReviewMiddleware.valid_update,
	ReviewController.update
);
router.delete(
	"/",
	Authorize("User"),
	ReviewMiddleware.valid_remove,
	ReviewController.remove
);

export default router;
