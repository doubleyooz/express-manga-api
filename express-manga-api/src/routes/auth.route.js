import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import express from "express";
import authController from "../controllers/auth.controller.js";
import { rolesAuth } from "../guards/jwt.guard.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import { getMessage } from "../utils/message.util.js";

const router = express.Router();

const ROUTES = {
  BASE: "/auth",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ACTIVATE: "/auth/activate/:token",
};

router.get(ROUTES.BASE, (req, res) => {
  return res.status(HttpStatusCodes.OK).json({ message: getMessage("default.return") });
});

router.get(ROUTES.LOGIN, authMiddleware.basicLogin, authController.basicLogin);

router.get(ROUTES.LOGOUT, rolesAuth(), authController.logout);

router.get(
  ROUTES.ACTIVATE,
  authMiddleware.activateAccount,
  authController.activateAccount,
);

// router.get("/me", Authorize(), SessionController.me);

export default router;
