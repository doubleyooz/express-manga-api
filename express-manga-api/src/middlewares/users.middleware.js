import yup from "yup";

import { decrypt } from "../utils/password.util.js";
import { user_rules as rules } from "../utils/yup.util.js";
import { STATUS_CODE_BAD_REQUEST } from "../utils/exception.util.js";

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
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
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
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
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
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
  }
}

async function update(req, res, next) {
  try {
    const result = await yup
      .object({
        name: rules.name,
        role: rules.role,
      })
      .validate(req.body, { abortEarly: false, stripUnknown: true });

    req.body = result;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json(err.inner.map((e) => e.message));
  }
}

export default {
  create,
  findOneById,
  find,
  update,
};
