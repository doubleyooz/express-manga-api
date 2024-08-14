import express from "express";
import multer from "multer";

import mangaController from "../controllers/manga.controller.js";
import mangaMiddleware from "../middlewares/manga.middleware.js";
import multerConfig from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/",
  multer(multerConfig.covers).array("covers"),
  mangaMiddleware.create,
  mangaController.create
);
router.get("/", mangaMiddleware.find, mangaController.find);
router.get("/:mangaId", mangaMiddleware.findOneById, mangaController.findOne);
router.put("/:mangaId", mangaMiddleware.update, mangaController.update);
router.delete("/:mangaId", mangaMiddleware.findOneById, mangaController.remove);

export default router;
