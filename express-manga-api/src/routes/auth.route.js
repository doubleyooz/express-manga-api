import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import { getMessage } from "../utils/message.util.js";
import { STATUS_CODE_OK } from "../utils/exception.util.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(STATUS_CODE_OK).json({ msg: getMessage("default.return") });
});

router.get("/login", authMiddleware.basicLogin, authController.basicLogin);

router.get(
  "/activate/:token",
  authMiddleware.activateAccount,
  authController.activateAccount
);

// router.get("/me", Authorize(), SessionController.me);

export default router;
