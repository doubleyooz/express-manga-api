import express from "express";

import { uploadAuthors } from "../config/multer.config.js";
import authorsController from "../controllers/authors.controller.js";
import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";

import authorsMiddleware from "../middlewares/authors.middleware.js";

const router = express.Router();

router.post(
  "/",
  rolesAuth(),
  uploadAuthors,
  authorsMiddleware.create,
  authorsController.create,
);
router.get("/", bypassAll, authorsMiddleware.find, authorsController.find);
router.get("/:_id", bypassAll, authorsMiddleware.findOneById, authorsController.findOne);
router.put("/:_id", rolesAuth(), authorsMiddleware.update, authorsController.update);
router.delete("/:_id", rolesAuth(), authorsMiddleware.findOneById, authorsController.remove);

export default router;
