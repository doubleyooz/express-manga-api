import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoIdReq, paramsIdResult, populate, mangaRules as rules, validateBody } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const expectedBody = {
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
      userId: mongoIdReq,
    };

    req.body = await validateBody({ ...req.body }, expectedBody, { abortEarly: false, stripUnknown: true });

    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function find(req, res, next) {
  try {
    const expectedBody = {
      title: rules.title,
      role: rules.role,
      populate,
    };

    req.query = await validateBody({ ...req.query }, expectedBody);

    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function update(req, res, next) {
  try {
    const expectedBody = {
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
    };

    req.body = await validateBody({ ...req.body }, expectedBody, { abortEarly: false, stripUnknown: true });

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
