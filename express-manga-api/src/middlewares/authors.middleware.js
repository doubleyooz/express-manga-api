import yup from "yup";
import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { pagesRule, paramsIdResult, authorRules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log("authors middleware");
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);
    const result = await yup
      .object({
        types: rules.types.min(1, "Need to provide at least one type").required(),
        name: rules.name.required(),
        files: pagesRule,
        birthDate: rules.birthDate.required(),
        deathDate: rules.deathDate,
        socialMedia: rules.socialMedia.required(),
        biography: rules.biography.required(),
      })
      .validate({ ...req.body, files: req.files }, { abortEarly: false, stripUnknown: true });

    console.log({ files: req.files });
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
        name: rules.name,
        types: rules.types,
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
        types: rules.types,
        name: rules.name,
        birthDate: rules.birthDate,
        deathDate: rules.deathDate,
        socialMedia: rules.socialMedia,
        biography: rules.biography,
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
