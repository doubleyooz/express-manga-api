import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import chapterService from "../services/chapters.service.js";

import {
  BadRequestException,
  CustomException,

  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(req, res) {
  try {
    const chapter = await chapterService.createChapter(req.body);

    return res.status(HttpStatusCodes.OK).json({
      message: getMessage("chapter.save.success"),
      data: chapter,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}
async function findOne(req, res) {
  const { chapterId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const chapter = await chapterService.findById(chapterId);

    return res.json({
      message: getMessage("chapter.findone.success"),
      data: chapter,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

async function find(req, res) {
  const { title, mangaId, populate } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  const role = req.role ? req.role : 0;

  req.role = null;

  const search
    = role === 1
      ? title
        ? { title: { $regex: `^${title}`, $options: "i" } }
        : {}
      : title
        ? { title: { $regex: `^${title}`, $options: "i" } }
        : {};

  if (mangaId)
    search.mangaId = mangaId;

  try {
    const result = await chapterService.findAll(search, populate);
    return res.json({
      message: getMessage("chapter.list.success"),
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
  const { chapterId } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await chapterService.updateChapter(
      { _id: chapterId },
      req.body,
    );
    return res.json({
      message: getMessage("chapter.update.success"),
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
  const { chapterId } = req.params;
  try {
    const result = await chapterService.deleteById(chapterId);
    return res.json({
      message: getMessage("chapter.delete.success"),
      data: result,
    });
  }
  catch (err) {
    console.log({ err });
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

export default { create, findOne, find, update, remove };
