import express from "express";

// import LikeController from '../controllers/like.controller.js';
// import NotifyController from '../controllers/notify.controller.js';
import userController from "../controllers/users.controller.js";

import { rolesAuth } from "../guards/jwt.guard.js";
import userMiddleware from "../middlewares/users.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/users",
  BY_ID: "/users/:_id",
};
// #swagger.tags = ['Authors']
router.post(ROUTES.BASE, userMiddleware.create, userController.create);
router.get(ROUTES.BY_ID, userMiddleware.findOneById, userController.findOneById);
router.get(ROUTES.BASE, userMiddleware.find, userController.find);
router.put(ROUTES.BASE, rolesAuth(), userMiddleware.update, userController.update);
router.delete(ROUTES.BASE, rolesAuth(), userController.deleteById);

export default router;
