import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import express from "express";
import authController from "../controllers/auth.controller.js";
import { rolesAuth } from "../guards/jwt.guard.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import { getMessage } from "../utils/message.util.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(HttpStatusCodes.OK).json({ msg: getMessage("default.return") });
});

router.get("/login", authMiddleware.basicLogin, authController.basicLogin);

router.get("/logout", rolesAuth(), authController.logout);

router.get(
  "/activate/:token",
  authMiddleware.activateAccount,
  authController.activateAccount,
);

// router.get("/me", Authorize(), SessionController.me);

export default router;
