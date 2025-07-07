import express from "express";

import { uploadCovers } from "../config/multer.config.js";

import coversController from "../controllers/covers.controller.js";

import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";
import coversMiddleware from "../middlewares/covers.middleware.js";

const router = express.Router();

router.post(
  "/",
  rolesAuth(),
  uploadCovers,
  coversMiddleware.create,
  coversController.create,
);
router.get("/", bypassAll, coversMiddleware.find, coversController.find);
router.get(
  "/:coverId",
  bypassAll,
  coversMiddleware.findOneById,
  coversController.findOne,
);
router.put(
  "/:coverId",
  rolesAuth(),
  coversMiddleware.update,
  coversController.update,
);
router.delete(
  "/:coverId",
  rolesAuth(),
  coversMiddleware.findOneById,
  coversController.remove,
);

export default router;
