import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import mangaService from "../services/manga.service.js";

import {
  CustomException,
} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(req, res) {
  try {
    const manga = await mangaService.createManga(req.body);

    return res.status(HttpStatusCodes.CREATED).json({
      message: HttpStatusMessages.CREATED,
      data: manga,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}
async function findOne(req, res) {
  const { mangaId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const manga = await mangaService.findById(mangaId);

    return res.json({
      message: HttpStatusMessages.OK,
      data: manga,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}

async function find(req, res) {
  const { title, populate } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  const role = req.role ? req.role : 0;
  console.log({ find: req.query });
  req.role = null;

  const search = {};
  if (title) {
    search.title = new RegExp(title, "i");
  }

  try {
    const result = await mangaService.findAll(search, populate);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    console.log("error", err);
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}

async function update(req, res) {
  const { mangaId } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await mangaService.updateManga({ _id: mangaId }, req.body);
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
  const { mangaId } = req.params;
  try {
    console.log({ mangaId });
    const result = await mangaService.deleteById(mangaId);

    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    console.log(err);
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
  }
}

export default { create, findOne, find, update, remove };
