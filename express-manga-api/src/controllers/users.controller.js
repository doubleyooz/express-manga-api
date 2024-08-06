import User from "../models/user.model.js";
import jwt from "../utils/jwt.util.js";

import usersService from "../services/users.service.js";

import { getMessage } from "../utils/message.util.js";
import { transporter } from "../config/nodemailer.config.js";
import {
  BadRequestException,
  CustomException,
  STATUS_CODE_SERVER_ERROR,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { decrypt } from "../utils/password.util.js";

const store = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const user = await usersService.createUser(req.body);

    return res.json({
      message: getMessage("user.activation.account.activate"),
      data: user,
    });
  } catch (err) {
    console.log(err);

    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};
const findOne = async (req, res) => {
  const { userId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const user = await usersService.findById(userId);

    return res.json({
      message: getMessage("user.findone.success"),
      data: user,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const find = async (req, res) => {
  const { name } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  let role = req.role ? decrypt(req.role) : 0;

  req.role = null;

  let search =
    role === 1
      ? name
        ? { name: { $regex: "^" + name, $options: "i" } }
        : {}
      : name
      ? { name: { $regex: "^" + name, $options: "i" }, active: true }
      : { active: true };

  try {
    const result = await usersService.findAll(search);
    return res.json({
      message: getMessage("user.list.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const update = async (req, res) => {
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await usersService.updateUser(decrypt(req.auth), req.body);
    return res.json({
      message: getMessage("user.update.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const remove = async (req, res) => {
  try {
    const result = await usersService.deleteById(decrypt(req.auth));
    return res.json({
      message: getMessage("user.delete.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

export default { store, findOne, find, update, remove };
