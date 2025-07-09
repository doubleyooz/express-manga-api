import yup from "yup";
import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoId, mongoIdReq, review_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const result = await yup
      .object({
        text: rules.text.required(),
        rating: rules.rating.required(),
        mangaId: mongoIdReq,
        userId: mongoIdReq,
      })
      .validate({ ...req.body, userId: req.auth }, { abortEarly: false, stripUnknown: true });

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
        text: rules.text,
        userId: mongoId,
        mangaId: mongoId,
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
        text: rules.text,
        rating: rules.rating,
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;

    const paramsResult = await yup
      .object({
        _id: mongoIdReq,
      })
      .validate(req.params, { stripUnknown: true });

    req.params = paramsResult;
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
