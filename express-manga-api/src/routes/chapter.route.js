import express from "express";
import multer from "multer";

import chapterController from "../controllers/chapters.controller.js";

import chapterMiddleware from "../middlewares/chapters.middleware.js";

import { rolesAuth } from "../guards/jwt.guard.js";
import multerConfig from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/",
  rolesAuth(),
  multer(multerConfig.chapters).array("pages"),
  chapterMiddleware.create,
  chapterController.create
);
router.get("/", rolesAuth(), chapterMiddleware.find, chapterController.find);
router.get(
  "/:chapterId",
  rolesAuth(),
  chapterMiddleware.findOneById,
  chapterController.findOne
);
router.put(
  "/:chapterId",
  rolesAuth(),
  chapterMiddleware.update,
  chapterController.update
);
router.delete(
  "/:chapterId",
  rolesAuth(),
  chapterMiddleware.findOneById,
  chapterController.remove
);

export default router;
