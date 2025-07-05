import express from "express";
import multer from "multer";

import multerConfig from "../config/multer.config.js";
import mangaController from "../controllers/manga.controller.js";
import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";

import mangaMiddleware from "../middlewares/manga.middleware.js";

const router = express.Router();

router.post(
  "/",
  rolesAuth(),
  multer(multerConfig.covers).array("covers"),
  mangaMiddleware.create,
  mangaController.create,
);
router.get("/", bypassAll, mangaMiddleware.find, mangaController.find);
router.get("/:mangaId", bypassAll, mangaMiddleware.findOneById, mangaController.findOne);
router.put("/:mangaId", rolesAuth(), mangaMiddleware.update, mangaController.update);
router.delete("/:mangaId", rolesAuth(), mangaMiddleware.findOneById, mangaController.remove);

export default router;
