import mangaService from "../services/manga.service.js";
import jwtService, {
  ACTIVATE_ACC_TOKEN_SECRET_INDEX,
} from "../services/jwt.service.js";

import { getMessage } from "../utils/message.util.js";
import {
  BadRequestException,
  CustomException,
  STATUS_CODE_OK,
  STATUS_CODE_SERVER_ERROR,
  STATUS_CODE_UNPROCESSABLE_ENTITY,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { decrypt } from "../utils/password.util.js";

const create = async (req, res) => {
  const { title } = req.body;

  try {
    const manga = await mangaService.createManga(req.body);

    return res.status(STATUS_CODE_OK).json({
      message: getMessage("manga.save.success"),
      data: manga,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};
const findOne = async (req, res) => {
  const { mangaId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const manga = await mangaService.findById(mangaId);

    return res.json({
      message: getMessage("user.findone.success"),
      data: manga,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const find = async (req, res) => {
  const { title } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  let role = req.role ? decrypt(req.role) : 0;

  req.role = null;

  let search =
    role === 1
      ? title
        ? { title: { $regex: "^" + title, $options: "i" } }
        : {}
      : title
      ? { title: { $regex: "^" + title, $options: "i" } }
      : {};

  try {
    const result = await mangaService.findAll(search);
    return res.json({
      message: getMessage("manga.list.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const update = async (req, res) => {
  const { mangaId } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await mangaService.updateManga({ _id: mangaId }, req.body);
    return res.json({
      message: getMessage("manga.update.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const remove = async (req, res) => {
  const { mangaId } = req.params;
  try {
    const result = await mangaService.deleteById(mangaId);
    return res.json({
      message: getMessage("manga.delete.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

export default { create, findOne, find, update, remove };
