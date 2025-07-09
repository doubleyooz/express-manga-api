import yup from "yup";
import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { pagesRequired, populate, cover_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log(req.body);
    const result = await yup
      .object({
        title: rules.title.required(),
        volume: rules.volume.required(),
        mangaId: rules._id.required(),
        language: rules.language.required(),
        files: pagesRequired,
      })
      .validate({ ...req.body, files: req.files }, { abortEarly: false, stripUnknown: true });

    req.body = result;
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function find(req, res, next) {
  try {
    const result = await yup
      .object({
        title: rules.title,
        mangaId: rules.manga_id,
        populate,
      })
      .validate(req.query, { abortEarly: true, stripUnknown: true });

    req.query = result;
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function update(req, res, next) {
  try {
    const result = await yup
      .object({
        title: rules.title,
        volume: rules.volume,
        mangaId: rules.mangaId,
        language: rules.language,
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;

    const paramsResult = await yup
      .object({
        chapterId: rules._id,
      })
      .validate(req.params, { stripUnknown: true });

    req.params = paramsResult;
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

export default {
  create,
  findOneById,
  find,
  update,
};
