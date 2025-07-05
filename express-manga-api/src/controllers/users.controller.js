import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import jwtService, {
  ACTIVATE_ACC_TOKEN_SECRET_INDEX,
} from "../services/jwt.service.js";
import usersService from "../services/users.service.js";

import {
  BadRequestException,
  CustomException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(req, res) {
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
        return res.status(err.status).json(err.message);

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

    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}
async function findOne(req, res) {
  const { userId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const user = await usersService.findById(userId);

    return res.json({
      message: getMessage("user.findone.success"),
      data: user,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

async function find(req, res) {
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
      message: getMessage("user.list.success"),
      data: result,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

async function update(req, res) {
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await usersService.updateUser(
      { _id: req.auth },
      req.body,
    );
    return res.json({
      message: getMessage("user.update.success"),
      data: result,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

async function remove(req, res) {
  try {
    const result = await usersService.deleteById(req.auth);
    return res.json({
      message: getMessage("user.delete.success"),
      data: result,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

export default { create, findOne, find, update, remove };
