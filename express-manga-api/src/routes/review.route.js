import express from "express";

import ReviewController from "../controllers/review.controller.js";

import { bypassAll, rolesAuth } from "../guards/jwt.guard.js";
import ReviewMiddleware from "../middlewares/review.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/reviews",
  BY_ID: "/reviews/:_id",
};

router.post(
  ROUTES.BASE,
  rolesAuth(),
  ReviewMiddleware.store,
  ReviewController.store,
);
router.get(ROUTES.BASE, bypassAll, ReviewMiddleware.list, ReviewController.list);
router.get(
  ROUTES.BY_ID,
  bypassAll,
  ReviewMiddleware.findById,
  ReviewController.findOne,
);
router.put(
  ROUTES.BY_ID,
  rolesAuth(),
  ReviewMiddleware.update,
  ReviewController.update,
);
router.delete(
  ROUTES.BY_ID,
  rolesAuth(),
  ReviewMiddleware.findById,
  ReviewController.remove,
);

export default router;
