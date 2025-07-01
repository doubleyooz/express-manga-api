import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import yup from "yup";

import { populate, chapter_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log(req.body);
    const result = await yup
      .object({
        title: rules.title.required(),
        number: rules.number.required(),
        mangaId: rules._id.required(),
        language: rules.language.required(),
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

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
        chapterId: rules._id,
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
        number: rules.number,
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
