import express from "express";
import multer from "multer";

import chapterController from "../controllers/chapters.controller.js";

import chapterMiddleware from "../middlewares/chapters.middleware.js";
import multerConfig from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/",
  multer(multerConfig.chapters).array("pages"),
  chapterMiddleware.create,
  chapterController.create
);
router.get("/", chapterMiddleware.find, chapterController.find);
router.get(
  "/:chapterId",
  chapterMiddleware.findOneById,
  chapterController.findOne
);
router.put("/:chapterId", chapterMiddleware.update, chapterController.update);
router.delete(
  "/:chapterId",
  chapterMiddleware.findOneById,
  chapterController.remove
);

export default router;
