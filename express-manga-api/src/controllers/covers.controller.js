import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import coversService from "../services/covers.service.js";

import {
  CustomException,
} from "../utils/exception.util.js";

async function create(req, res) {
  try {
    const chapter = await coversService.createCover(req.body);

    return res.status(HttpStatusCodes.OK).json({
      message: HttpStatusMessages.CREATED,
      data: chapter,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}
async function findOne(req, res) {
  const { coverId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const chapter = await coversService.findById(coverId);

    return res.json({
      message: HttpStatusMessages.OK,
      data: chapter,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
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
    const result = await coversService.findAll(search, populate);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}

async function update(req, res) {
  const { coverId } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await coversService.updateChapter(
      { _id: coverId },
      req.body,
    );
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}

async function remove(req, res) {
  const { coverId } = req.params;
  try {
    const result = await coversService.deleteById(coverId);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    console.log({ err });
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}

export default { create, findOne, find, update, remove };
