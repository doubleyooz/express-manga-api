import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import mangaService from "../services/manga.service.js";
import jwtService, {
  ACTIVATE_ACC_TOKEN_SECRET_INDEX,
} from "../services/jwt.service.js";

import { getMessage } from "../utils/message.util.js";
import {
  BadRequestException,
  CustomException, 
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { decrypt } from "../utils/password.util.js";

const create = async (req, res) => {
  const { title } = req.body;
  console.log({ file: req.file, files: req.files });
  try {
    const manga = await mangaService.createManga(req.body);

    return res.status(HttpStatusCodes.OK).json({
      message: getMessage("manga.save.success"),
      data: manga,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
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

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const find = async (req, res) => {
  const { title, populate } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  const role = req.role ? decrypt(req.role) : 0;
  console.log({find: req.query})
  req.role = null;

  const search = {};
  if (title) {
    search.title = new RegExp(title, 'i');
  }

  try {
    const result = await mangaService.findAll(search, populate);
    return res.json({
      message: getMessage("manga.list.success"),
      data: result,
    });
  } catch (err) {
    console.log("error", err)
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
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

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const remove = async (req, res) => {
  const { mangaId } = req.params;
  try {
    console.log({ mangaId });
    const result = await mangaService.deleteById(mangaId);

    return res.json({
      message: getMessage("manga.delete.success"),
      data: result,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export default { create, findOne, find, update, remove };
