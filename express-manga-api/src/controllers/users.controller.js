import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { deleteById, find, findOneById, update } from "../database/abstract.controller.js";
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
    const user = await usersService.create(req.body);
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

export default {
  create,
  findOneById: (req, res, next) => findOneById(usersService, req, res, next),
  find: (req, res, next) => find(usersService, req, res, next),
  update: (req, res, next) => update(usersService, req, res, next, true),
  deleteById: (req, res, next) => deleteById(usersService, req, res, next, true),
};
