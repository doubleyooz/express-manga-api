import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import yup from "yup";

import { populate, manga_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log(req.body);
    const result = await yup
      .object({
        title: rules.title.required(),
        genres: rules.genres.required(),
        themes: rules.themes.required(),
        writers: rules.writers,
        artists: rules.artists,
        synopsis: rules.synopsis.required(),
        nChapters: rules.nChapters.required(),
        status: rules.status.required(),
        nsfw: rules.nsfw.required(),
        type: rules.type.required(),
        languages: rules.languages.required(),
        images: rules.covers,
      })
      .validate({ ...req.body, images: req.files }, { abortEarly: false, stripUnknown: true });

    console.log({ files: req.files });
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
        mangaId: rules._id,
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
        role: rules.role,
        populate,
      })
      .validate(req.query, { abortEarly: true, stripUnknown: true });
    console.log({ result });
    req.query = result;
    next();
  }
  catch (err) {
    console.log("error");
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
        genres: rules.genres,
        themes: rules.themes,
        writers: rules.writers,
        artists: rules.artists,
        synopsis: rules.synopsis,
        nChapters: rules.nChapters,
        status: rules.status,
        nsfw: rules.nsfw,
        type: rules.type,
        languages: rules.languages,
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;

    const paramsResult = await yup
      .object({
        mangaId: rules._id,
      })
      .validate(req.params, { stripUnknown: true });

    req.params = paramsResult;
    next();
  }
  catch (err) {
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
