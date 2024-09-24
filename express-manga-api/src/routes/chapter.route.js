import express from "express";
import multer from "multer";

import chapterController from "../controllers/chapters.controller.js";

import chapterMiddleware from "../middlewares/chapters.middleware.js";

import { bypassAll } from "../guards/jwt.guard.js";
import multerConfig from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/",
  bypassAll,
  multer(multerConfig.chapters).array("pages"),
  chapterMiddleware.create,
  chapterController.create
);
router.get("/", bypassAll, chapterMiddleware.find, chapterController.find);
router.get(
  "/:chapterId",
  bypassAll,
  chapterMiddleware.findOneById,
  chapterController.findOne
);
router.put(
  "/:chapterId",
  bypassAll,
  chapterMiddleware.update,
  chapterController.update
);
router.delete(
  "/:chapterId",
  bypassAll,
  chapterMiddleware.findOneById,
  chapterController.remove
);

export default router;
