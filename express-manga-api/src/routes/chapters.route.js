import express from "express";

import { uploadChapters } from "../config/multer.config.js";

import chapterController from "../controllers/chapters.controller.js";

import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";
import chapterMiddleware from "../middlewares/chapters.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/chapters",
  BY_ID: "/chapters/:_id",
};

router.post(ROUTES.BASE, rolesAuth(), uploadChapters, chapterMiddleware.create, chapterController.create);
router.get(ROUTES.BASE, bypassAll, chapterMiddleware.find, chapterController.find);
router.get(ROUTES.BY_ID, bypassAll, chapterMiddleware.findOneById, chapterController.findOneById);
router.put(ROUTES.BY_ID, rolesAuth(), chapterMiddleware.update, chapterController.update);
router.delete(ROUTES.BY_ID, rolesAuth(), chapterMiddleware.findOneById, chapterController.deleteById);

export default router;
