import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import express from "express";
import authController from "../controllers/auth.controller.js";
import { basicHashAuth, rolesAuth } from "../guards/jwt.guard.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const ROUTES = {
  BASE: "/auth",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ACTIVATE: "/auth/activate/:token",
};

router.get(ROUTES.BASE, (req, res) => {
  return res.status(HttpStatusCodes.OK).json({ message: HttpStatusMessages.OK });
});

router.get(ROUTES.LOGIN, basicHashAuth, authMiddleware.basicLogin, authController.basicLogin);

router.get(ROUTES.LOGOUT, rolesAuth(), authController.logout);

router.get(ROUTES.ACTIVATE, authMiddleware.activateAccount, authController.activateAccount);

// router.get("/me", rolesAuth(), authController.me);

export default router;
