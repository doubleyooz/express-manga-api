import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import jwtService, {
  ACTIVATE_ACC_TOKEN_SECRET_INDEX,
} from "../services/jwt.service.js";
import usersService from "../services/users.service.js";

import {
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(req, res, next) {
  const { email, password, name, role } = req.body;

  try {
    const user = await usersService.createUser(req.body);
    const activationToken = jwtService.generateJwt(
      {
        _id: user._id,
        tokenVersion: user.tokenVersion,
      },
      ACTIVATE_ACC_TOKEN_SECRET_INDEX,
    );
    return res.status(HttpStatusCodes.OK).json({
      message: getMessage("user.activation.account.activate"),
      data: activationToken,
    });
  }
  catch (err) {
    if (err instanceof UnprocessableEntityException) {
      const user = await usersService.getUser(
        { email, active: false },
        { _id: true, tokenVersion: true },
        false,
      );
      if (!user)
        return res.status(err.status).json({ message: err.message });

      const activationToken = jwtService.generateJwt(
        {
          _id: user._id,
          tokenVersion: user.tokenVersion,
        },
        ACTIVATE_ACC_TOKEN_SECRET_INDEX,
      );
      return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
        message: getMessage("user.activation.account.activate"),
        data: activationToken,
      });
    }

    next(err);
  }
}
async function findOne(req, res, next) {
  const { userId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const user = await usersService.findById(userId);

    return res.json({
      message: HttpStatusMessages.OK,
      data: user,
    });
  }
  catch (err) {
    next(err);
  }
}

async function find(req, res, next) {
  const { name } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  const role = req.role ? req.role : 0;

  req.role = null;

  const search
    = role === 1
      ? name
        ? { name: { $regex: `^${name}`, $options: "i" } }
        : {}
      : name
        ? { name: { $regex: `^${name}`, $options: "i" }, active: true }
        : { active: true };

  try {
    const result = await usersService.findAll(search);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await usersService.updateUser(
      { _id: req.auth },
      req.body,
    );
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await usersService.deleteById(req.auth);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

export default { create, findOne, find, update, remove };
