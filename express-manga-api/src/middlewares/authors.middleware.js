import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { pagesRule, paramsIdResult, authorRules as rules, validateBody } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const expectedBody = {
      types: rules.types.min(1, "Need to provide at least one type").required(),
      name: rules.name.required(),
      files: pagesRule,
      birthDate: rules.birthDate.required(),
      deathDate: rules.deathDate,
      socialMedia: rules.socialMedia.required(),
      biography: rules.biography.required(),
    };

    req.body = await validateBody({ ...req.body, files: req.files }, expectedBody);
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function find(req, res, next) {
  try {
    const expectedBody = {
      name: rules.name,
      types: rules.types,
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
      types: rules.types,
      name: rules.name,
      birthDate: rules.birthDate,
      deathDate: rules.deathDate,
      socialMedia: rules.socialMedia,
      biography: rules.biography,
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
