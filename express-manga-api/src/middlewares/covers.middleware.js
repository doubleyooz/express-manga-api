import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import yup from "yup";

import { populate, cover_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log(req.body);
    const result = await yup
      .object({
        title: rules.title.required(),
        volume: rules.volume.required(),
        mangaId: rules._id.required(),
        language: rules.language.required(),
        files: rules.pages.required(),
      })
      .validate({ ...req.body, files: req.files }, { abortEarly: false, stripUnknown: true });

    req.body = result;
    next();
  }
  catch (err) {
    console.log(err);
    return res.status(HttpStatusCodes.BAD_REQUEST).json(err.errors);
  }
}

async function findOneById(req, res, next) {
  try {
    const result = await yup
      .object({
        coverId: rules._id,
      })
      .validate(req.params, { stripUnknown: true });

    req.params = result;
    next();
  }
  catch (err) {
    console.log(err);
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json(err.inner.map(e => e.message));
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
    console.log(err);
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json(err.inner.map(e => e.message));
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
    console.log(err);
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json(err.inner.map(e => e.message));
  }
}

export default {
  create,
  findOneById,
  find,
  update,
};
