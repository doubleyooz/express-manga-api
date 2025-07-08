import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import authorsService from "../services/authors.service.js";

async function create(req, res, next) {
  try {
    console.log({ body: req.body });
    const author = await authorsService.createAuthor(req.body);

    return res.status(HttpStatusCodes.CREATED).json({
      message: HttpStatusMessages.CREATED,
      data: author,
    });
  }
  catch (err) {
    next(err);
  }
}
async function findOne(req, res, next) {
  console.log("findOne controller");
  const { mangaId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const author = await authorsService.findById(mangaId);

    return res.json({
      message: HttpStatusMessages.OK,
      data: author,
    });
  }
  catch (err) {
    next(err);
  }
}

async function find(req, res, next) {
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
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
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
    next(err);
  }
}

async function remove(req, res, next) {
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
    next(err);
  }
}

export default { create, findOne, find, update, remove };
