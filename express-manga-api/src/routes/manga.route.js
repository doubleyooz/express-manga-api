import express from "express";
import mangaController from "../controllers/manga.controller.js";
import mangaMiddleware from "../middlewares/manga.middleware.js";

const router = express.Router();

router.post("/", mangaMiddleware.create, mangaController.create);
router.get("/", mangaMiddleware.find, mangaController.find);
router.get("/:mangaId", mangaMiddleware.findOneById, mangaController.findOne);
router.put("/:mangaId", mangaMiddleware.update, mangaController.update);
router.delete("/", mangaMiddleware.findOneById, mangaController.remove);

export default router;
