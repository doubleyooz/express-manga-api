import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import authorsService from "../services/authors.service.js";
import {
  CustomException,

} from "../utils/exception.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(req, res) {
  try {
    console.log({ body: req.body });
    const author = await authorsService.createAuthor(req.body);

    return res.status(HttpStatusCodes.CREATED).json({
      message: HttpStatusMessages.CREATED,
      data: author,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
}
async function findOne(req, res) {
  const { mangaId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const manga = await authorsService.findById(mangaId);

    return res.json({
      message: getMessage("author.findone.success"),
      data: manga,
    });
  }
  catch (err) {
    if (err instanceof CustomException)
      return res.status(err.status).json(err.message);

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
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
    const result = await authorsService.findAll(search, populate);
    return res.json({
      message: getMessage("author.list.success"),
      data: result,
    });
  }
  catch (err) {
    console.log("error", err);
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

async function update(req, res) {
  const { _id } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await authorsService.updateAuthor({ _id }, req.body);
    return res.json({
      message: HttpStatusMessages.OK,
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
  const { _id } = req.params;
  try {
    console.log({ _id });
    const result = await authorsService.deleteById(_id);

    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    console.log(err);
    if (err instanceof CustomException)
      return res.status(err.status).json({ message: err.message, data: [] });

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}

export default { create, findOne, find, update, remove };
