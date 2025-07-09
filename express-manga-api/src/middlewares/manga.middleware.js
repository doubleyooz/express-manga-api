import yup from "yup";
import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoIdReq, paramsIdResult, populate, mangaRules as rules } from "../utils/yup.util.js";

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
        owner: mongoIdReq,
      })
      .validate({ ...req.body, owner: req.auth }, { abortEarly: false, stripUnknown: true });

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
        role: rules.role,
        populate,
      })
      .validate(req.query, { abortEarly: true, stripUnknown: true });
    console.log({ result });
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

    req.params = await paramsIdResult(req.params);
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
