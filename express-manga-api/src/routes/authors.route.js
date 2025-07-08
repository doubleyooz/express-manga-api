import express from "express";

import { uploadAuthors } from "../config/multer.config.js";
import authorsController from "../controllers/authors.controller.js";
import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";

import authorsMiddleware from "../middlewares/authors.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/authors",
  BY_ID: "/authors/:_id",
};
// #swagger.tags = ['Authors']
// #swagger.summary = 'Create a new author'
// #swagger.description = 'Create a new author with optional file upload'
router.post(ROUTES.BASE, rolesAuth(), uploadAuthors, authorsMiddleware.create, authorsController.create);
router.get(ROUTES.BASE, bypassAll, authorsMiddleware.find, authorsController.find);
router.get(ROUTES.BY_ID, bypassAll, authorsMiddleware.findOneById, authorsController.findOne);
router.put(ROUTES.BY_ID, rolesAuth(), authorsMiddleware.update, authorsController.update);
router.delete(ROUTES.BY_ID, rolesAuth(), authorsMiddleware.findOneById, authorsController.remove);

export default router;
