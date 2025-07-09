import * as crypto from "node:crypto";
import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

import jwtService, {
  ACTIVATE_ACC_TOKEN_SECRET_INDEX,
  REFRESH_TOKEN_SECRET_INDEX,
} from "../services/jwt.service.js";

import usersService from "../services/users.service.js";
import {
  UnauthorisedException,
} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";
import { matchPassword } from "../utils/password.util.js";

async function basicLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    // console.log(crypto.randomBytes(16).toString("hex"));
    const user = await usersService.getUser(
      { email, active: true },
      { password: true, role: true, tokenVersion: true },
    );

    const match = user ? matchPassword(user.password, password) : null;

    if (!match) {
      throw UnauthorisedException();
    }

    const payload = {
      _id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const token = jwtService.generateJwt(payload);
    const refreshToken = jwtService.generateJwt(
      payload,
      REFRESH_TOKEN_SECRET_INDEX,
    );

    req.headers.authorization = `Bearer ${token}`;
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      path: "/refresh-token",
    });

    user.password = undefined;
    return res.status(HttpStatusCodes.OK).json({
      message: getMessage("user.valid.sign_in.success"),
      data: token,
    });
  }
  catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    console.log({ auth: req.auth, newToken: req.newToken });
    const user = await usersService.updateTokenVersion(
      req.auth,
    );

    if (!user)
      throw UnauthorisedException();

    delete req.newToken;
    delete req.auth;

    return res.status(HttpStatusCodes.OK).json({
      message: HttpStatusMessages.OK,
    });
  }
  catch (err) {
    next(err);
  }
};

async function activateAccount(req, res, next) {
  try {
    const { token } = req.params;

    const payload = jwtService.verifyJwt(
      token,
      ACTIVATE_ACC_TOKEN_SECRET_INDEX,
    );

    console.log({ payload });

    const user = await usersService.updateUser(
      { _id: payload._id, tokenVersion: payload.tokenVersion },
      {
        active: true,
        tokenVersion: payload.tokenVersion + 1,
      },
    );

    return res.status(HttpStatusCodes.OK).json({
      message: getMessage("user.activation.account.success"),
      data: user,
    });
  }
  catch (err) {
    next(err);
  }
}

export default {
  basicLogin,
  activateAccount,
  logout,
};
