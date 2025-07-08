import yup from "yup";
import { BadRequestException } from "../utils/exception.util.js";

import { user_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const result = await yup
      .object({
        email: rules.email,
        password: rules.password,
        name: rules.name.required(),
        role: rules.role.required(),
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

async function findOneById(req, res, next) {
  try {
    const result = await yup
      .object({
        userId: rules._id,
      })
      .validate(req.query, { stripUnknown: true });

    req.query = result;
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
        role: rules.role,
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
    console.log("update user middleware", req.body);
    const result = await yup
      .object({
        name: rules.name,
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;
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
