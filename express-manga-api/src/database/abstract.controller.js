import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

async function create(_service, req, res, next) {
  try {
    const document = await _service.create(req.body);

    return res.status(HttpStatusCodes.CREATED).json({
      message: HttpStatusMessages.CREATED,
      data: document,
    });
  }
  catch (err) {
    next(err);
  }
}

async function findOneById(_service, req, res, next) {
  const { _id } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const author = await _service.findById(_id);

    return res.json({
      message: HttpStatusMessages.OK,
      data: author,
    });
  }
  catch (err) {
    next(err);
  }
}

async function find(_service, req, res, next) {
  const { title, mangaId, name, populate } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  const role = req.role ? req.role : 0;

  req.role = null;

  const search = {};

  if (title) {
    search.title = { $regex: `^${title}`, $options: "i" };
  }

  if (name) {
    search.name = { $regex: `^${name}`, $options: "i" };

    if (role === 0)
      search.active = true;
  }

  if (mangaId) {
    search.mangaId = mangaId;
  }

  try {
    const result = await _service.findAll(search, populate);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

async function update(_service, req, res, next, authId = false) {
  const { _id } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await _service.update({ _id: authId ? req.auth : _id }, req.body);
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

async function deleteById(_service, req, res, next, authId = false) {
  const { _id } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  try {
    const result = await _service.deleteById({ _id: authId ? req.auth : _id });
    return res.json({
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

export { create, deleteById, find, findOneById, update };
