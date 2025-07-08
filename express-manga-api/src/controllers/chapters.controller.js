import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import chapterService from "../services/chapters.service.js";

async function create(req, res, next) {
  try {
    const chapter = await chapterService.createChapter(req.body);

    return res.status(HttpStatusCodes.OK).json({
      message: HttpStatusMessages.CREATED,
      data: chapter,
    });
  }
  catch (err) {
    next(err);
  }
}
async function findOne(req, res, next) {
  const { chapterId } = req.query;

  const newToken = req.newToken || null;
  req.newToken = null;

  try {
    const chapter = await chapterService.findById(chapterId);

    return res.json({
      message: HttpStatusMessages.OK,
      data: chapter,
    });
  }
  catch (err) {
    next(err);
  }
}

async function find(req, res, next) {
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
      message: HttpStatusMessages.OK,
      data: result,
    });
  }
  catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  const { chapterId } = req.params;
  const newToken = req.newToken ? req.newToken : null;
  req.newToken = null;

  try {
    const result = await chapterService.updateChapter(
      { _id: chapterId },
      req.body,
    );
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
  const { chapterId } = req.params;
  try {
    const result = await chapterService.deleteById(chapterId);
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
