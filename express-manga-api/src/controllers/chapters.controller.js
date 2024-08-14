import chapterService from "../services/chapters.service.js";
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
  console.log({ file: req.file, files: req.files });
  try {
    const chapter = await chapterService.createChapter(req.body);

    return res.status(STATUS_CODE_OK).json({
      message: getMessage("chapter.save.success"),
      data: chapter,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};
const findOne = async (req, res) => {
  const { chapterId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const chapter = await chapterService.findById(chapterId);

    return res.json({
      message: getMessage("chapter.findone.success"),
      data: chapter,
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

  console.log(search);
  try {
    const result = await chapterService.findAll(search);
    return res.json({
      message: getMessage("chapter.list.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const update = async (req, res) => {
  const { chapterId } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await chapterService.updateChapter(
      { _id: chapterId },
      req.body
    );
    return res.json({
      message: getMessage("chapter.update.success"),
      data: result,
    });
  } catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(STATUS_CODE_SERVER_ERROR).json(err);
  }
};

const remove = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const result = await chapterService.deleteById(chapterId);
    console.log({ result });
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
