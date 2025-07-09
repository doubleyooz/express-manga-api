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
  ReviewMiddleware.create,
  ReviewController.create,
);
router.get(ROUTES.BASE, bypassAll, ReviewMiddleware.findAll, ReviewController.findAll);
router.get(
  ROUTES.BY_ID,
  bypassAll,
  ReviewMiddleware.findById,
  ReviewController.findOneById,
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
  ReviewController.deleteById,
);

export default router;
