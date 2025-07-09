import express from "express";

import ReviewController from "../controllers/review.controller.js";
import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";
import ReviewMiddleware from "../middlewares/reviews.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/reviews",
  BY_ID: "/reviews/:_id",
};

router.post(ROUTES.BASE, rolesAuth(), ReviewMiddleware.create, ReviewController.create);
router.get(ROUTES.BASE, bypassAll, ReviewMiddleware.find, ReviewController.find);
router.get(ROUTES.BY_ID, bypassAll, ReviewMiddleware.findOneById, ReviewController.findOneById);
router.put(ROUTES.BY_ID, rolesAuth(), ReviewMiddleware.update, ReviewController.update);
router.delete(ROUTES.BY_ID, rolesAuth(), ReviewMiddleware.findOneById, ReviewController.deleteById);

export default router;
