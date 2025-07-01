import express from "express";
import multer from "multer";

import multerConfig from "../config/multer.config.js";

import AuthorController from "../controllers/author.controller.js";
import AuthorMiddleware from "../middlewares/author.middleware.js";

import {
  auth as Authorize,
  easyAuth,
} from "../middlewares/session.middleware.js";

const router = express.Router();
const upload = multer(multerConfig.authorFiles).array("imgCollection");

router.post(
  "/",
  upload,
  Authorize("Scan"),
  AuthorMiddleware.store,
  AuthorController.store,
);
router.put(
  "/",
  upload,
  Authorize("Scan"),
  AuthorMiddleware.update,

  AuthorController.update,
);
router.get("/", easyAuth(), AuthorMiddleware.list, AuthorController.list);
router.get(
  "/findOne",
  easyAuth(),
  AuthorMiddleware.findById,
  AuthorController.findOne,
);
router.delete(
  "/",
  Authorize("Scan"),
  AuthorMiddleware.findById,
  AuthorController.remove,
);

export default router;
