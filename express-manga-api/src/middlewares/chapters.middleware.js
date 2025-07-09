import yup from "yup";
import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoId, pagesRequired, paramsIdResult, populate, chapterRules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log(req.body);
    const result = await yup
      .object({
        title: rules.title.required(),
        number: rules.number.required(),
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
        mangaId: mongoId,
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
        number: rules.number,
        language: rules.language,
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
