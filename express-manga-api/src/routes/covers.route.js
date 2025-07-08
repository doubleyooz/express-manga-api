import express from "express";

import { uploadCovers } from "../config/multer.config.js";

import coversController from "../controllers/covers.controller.js";

import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";
import coversMiddleware from "../middlewares/covers.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/covers",
  BY_ID: "/covers/:_id",
};

router.post(ROUTES.BASE, rolesAuth(), uploadCovers, coversMiddleware.create, coversController.create);
router.get(ROUTES.BASE, bypassAll, coversMiddleware.find, coversController.find);
router.get(ROUTES.BY_ID, bypassAll, coversMiddleware.findOneById, coversController.findOne);
router.put(ROUTES.BY_ID, rolesAuth(), coversMiddleware.update, coversController.update);
router.delete(ROUTES.BY_ID, rolesAuth(), coversMiddleware.findOneById, coversController.remove);

export default router;
