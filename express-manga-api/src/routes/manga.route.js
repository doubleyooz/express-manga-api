import express from "express";

import { uploadCovers } from "../config/multer.config.js";
import mangaController from "../controllers/manga.controller.js";
import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";

import mangaMiddleware from "../middlewares/manga.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/manga",
  BY_ID: "/manga/:_id",
};

router.post(ROUTES.BASE, rolesAuth(), uploadCovers, mangaMiddleware.create, mangaController.create);
router.get(ROUTES.BASE, bypassAll, mangaMiddleware.find, mangaController.find);
router.get(ROUTES.BY_ID, bypassAll, mangaMiddleware.findOneById, mangaController.findOne);
router.put(ROUTES.BY_ID, rolesAuth(), mangaMiddleware.update, mangaController.update);
router.delete(ROUTES.BY_ID, rolesAuth(), mangaMiddleware.findOneById, mangaController.remove);

export default router;
