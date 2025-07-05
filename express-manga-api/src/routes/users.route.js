import express from "express";

// import LikeController from '../controllers/like.controller.js';
// import NotifyController from '../controllers/notify.controller.js';
import userController from "../controllers/users.controller.js";

import { rolesAuth } from "../guards/jwt.guard.js";
import userMiddleware from "../middlewares/users.middleware.js";

const router = express.Router();

router.post("/", userMiddleware.create, userController.create);
router.get("/:userId", userMiddleware.findOneById, userController.findOne);
router.get("/", userMiddleware.find, userController.find);
router.put("/", rolesAuth(), userMiddleware.update, userController.update);
router.delete("/", rolesAuth(), userController.remove);

export default router;
