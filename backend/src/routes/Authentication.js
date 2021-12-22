import express from "express";

import UserController from "../controllers/UserController.js";
import SessionController from "../controllers/SessionController.js";

import UserMiddleware from "../middlewares/UserMiddleware.js";

import { auth as Authorize, easyAuth } from "../middlewares/SessionMiddleware.js";
import { getMessage } from "../common/messages.js";

const router = express.Router();

router.get("/", (req, res) => {
	return res.jsonOK(null, getMessage("default.return"), null);
});

router.get("/me", Authorize(), SessionController.me);

router.post("/authentication/activate/:tky", SessionController.activateAccount); // POST
router.put("/authentication/recover/:tky", SessionController.recoverPassword); // PUT

router.post("/google-sign-up", UserMiddleware.valid_google_sign_up, UserController.store);
router.post("/sign-up", UserMiddleware.valid_sign_up, UserController.store);

router.get("/sign-in", UserMiddleware.valid_sign_in, SessionController.sign_in);
router.post("/google-sign-in", SessionController.google_sign_in);

router.get("/refresh-token", SessionController.refreshAccessToken);

export default router;
