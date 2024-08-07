import * as crypto from "crypto";
import {
  CustomException,
  STATUS_CODE_OK,
  STATUS_CODE_SERVER_ERROR,
  STATUS_CODE_UNAUTHORIZED,
} from "../utils/exception.util.js";
import { matchPassword } from "../utils/password.util.js";
import { getMessage } from "../utils/message.util.js";
import jwtService, {
  ACTIVATE_ACC_TOKEN_SECRET_INDEX,
  REFRESH_TOKEN_SECRET_INDEX,
} from "../services/jwt.service.js";
import usersService from "../services/users.service.js";

async function basicLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log(crypto.randomBytes(16).toString("hex"));
    const user = await usersService.getUser(
      { email: email, active: true },
      { password: true, role: true, tokenVersion: true }
    );

    const match = user ? matchPassword(user.password, password) : null;

    if (!match) {
      return res
        .status(STATUS_CODE_UNAUTHORIZED)
        .json({ message: getMessage("default.unauthorized") });
    }

    const payload = {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const token = jwtService.generateJwt(payload);
    const refreshToken = jwtService.generateJwt(
      payload,
      REFRESH_TOKEN_SECRET_INDEX
    );

    req.headers.authorization = `Bearer ${token}`;
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      path: "/refresh-token",
    });

    user.password = undefined;
    return res.status(STATUS_CODE_OK).json({
      msg: getMessage("user.valid.sign_in.success"),
      data: token,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
}

async function logout(req, res) {}

async function activateAccount(req, res) {
  try {
    const { token } = req.params;

    const payload = jwtService.verifyJwt(
      token,
      ACTIVATE_ACC_TOKEN_SECRET_INDEX
    );

    console.log({ payload });

    const user = await usersService.updateUser(
      { _id: payload._id, tokenVersion: payload.tokenVersion },
      {
        active: true,
        tokenVersion: payload.tokenVersion + 1,
      }
    );

    return res.status(STATUS_CODE_OK).json({
      msg: getMessage("user.activation.account.success"),
      data: user,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
}

export default {
  basicLogin,
  activateAccount,
};
