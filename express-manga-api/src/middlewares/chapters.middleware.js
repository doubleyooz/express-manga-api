import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoId, pagesRequired, paramsIdResult, populate, chapterRules as rules, validateBody } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const expectedBody = {
      title: rules.title.required(),
      number: rules.number.required(),
      mangaId: rules._id.required(),
      language: rules.language.required(),
      files: pagesRequired,
    };

    req.body = await validateBody({ ...req.body, files: req.files }, expectedBody, { abortEarly: false, stripUnknown: true });
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
      mangaId: mongoId,
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
      number: rules.number,
      language: rules.language,
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
