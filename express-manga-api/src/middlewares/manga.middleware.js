import yup from "yup";

import { decrypt } from "../utils/password.util.js";
import { manga_rules as rules } from "../utils/yup.util.js";
import { STATUS_CODE_BAD_REQUEST } from "../utils/exception.util.js";

async function create(req, res, next) {
  try {
    const result = await yup
      .object({
        title: rules.title.required(),
        genres: rules.genres.required(),
        themes: rules.themes.required(),
        writerId: rules.writerId.required(),
        artistId: rules.artistId.required(),
        synopsis: rules.synopsis.required(),
        nChapters: rules.nChapters.required(),
        status: rules.status.required(),
        nsfw: rules.nsfw.required(),
        type: rules.type.required(),
        languages: rules.languages.required(),
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
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
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
  }
}

async function find(req, res, next) {
  try {
    const result = await yup
      .object({
        title: rules.title,
        role: rules.role,
      })
      .validate(req.query, { abortEarly: true, stripUnknown: true });

    req.query = result;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
  }
}

async function update(req, res, next) {
  try {
    const result = await yup
      .object({
        title: rules.title,
        genres: rules.genres,
        themes: rules.themes,
        writerId: rules.writerId,
        artistId: rules.artistId,
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
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
  }
}

export default {
  create,
  findOneById,
  find,
  update,
};
