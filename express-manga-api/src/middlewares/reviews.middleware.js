import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoId, mongoIdReq, paramsIdResult, reviewRules as rules, validateBody } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const expectedBody = {
      text: rules.text.required(),
      rating: rules.rating.required(),
      mangaId: mongoIdReq,
      userId: mongoIdReq,
    };

    req.body = await validateBody({ ...req.body, userId: req.auth }, expectedBody, { abortEarly: false, stripUnknown: true });

    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function find(req, res, next) {
  try {
    const expectedBody = {
      text: rules.text,
      userId: mongoId,
      mangaId: mongoId,
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
      text: rules.text,
      rating: rules.rating,
    };

    req.body = await validateBody({ ...req.body, userId: req.auth }, expectedBody, { abortEarly: false, stripUnknown: true });

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
