import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import yup from "yup";

import { author_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    console.log("authors middleware");
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);
    const result = await yup
      .object({
        types: rules.types.min(1, "Need to provide at least one type").required(),
        name: rules.name.required(),
        files: rules.imgCollection,
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
    console.log({ err });
    return res.status(HttpStatusCodes.BAD_REQUEST).json(err);
  }
}

async function findOneById(req, res, next) {
  try {
    const result = await yup
      .object({
        _id: rules._id,
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
        name: rules.name,
        types: rules.types,
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
        types: rules.types,
        name: rules.name,
        birthDate: rules.birthDate,
        deathDate: rules.deathDate,
        socialMedia: rules.socialMedia,
        biography: rules.biography,
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;

    const paramsResult = await yup
      .object({
        _id: rules._id,
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
