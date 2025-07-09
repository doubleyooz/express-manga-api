import express from "express";

import mangaController from "../controllers/manga.controller.js";
import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";

import mangaMiddleware from "../middlewares/manga.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/manga",
  BY_ID: "/manga/:_id",
};

router.post(ROUTES.BASE, rolesAuth(), mangaMiddleware.create, mangaController.create);
router.get(ROUTES.BASE, bypassAll, mangaMiddleware.find, mangaController.find);
router.get(ROUTES.BY_ID, bypassAll, mangaMiddleware.findOneById, mangaController.findOneById);
router.put(ROUTES.BY_ID, rolesAuth(), mangaMiddleware.update, mangaController.update);
router.delete(ROUTES.BY_ID, rolesAuth(), mangaMiddleware.findOneById, mangaController.deleteById);

export default router;
