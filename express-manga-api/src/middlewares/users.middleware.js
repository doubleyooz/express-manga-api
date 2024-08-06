import yup from "yup";

import { decrypt } from "../utils/password.util.js";
import { user_rules as rules } from "../utils/yup.util.js";

async function create(req, res, next) {
  const yupObject = yup.object().shape({
    email: rules.email,
    password: rules.password,
    name: rules.name.required(),
    role: rules.role.required(),
  });

  yupObject
    .validate(req.body, { stripUnknown: true })
    .then((result) => {
      req.body = result;
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.jsonBadRequest(null, null, err.errors);
    });
}

async function findOne(req, res, next) {
  let schema = yup.object().shape({
    user_id: rules._id,
  });

  schema
    .validate(req.query, { stripUnknown: true })
    .then((result) => {
      req.query = result;
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.jsonBadRequest(null, null, err.errors);
    });
}

async function list(req, res, next) {
  let schema = yup.object().shape({
    name: rules.name,
  });

  schema
    .validate(req.query, { stripUnknown: true })
    .then((result) => {
      req.query = result;
      next();
    })
    .catch((err) => {
      return res.jsonBadRequest(null, null, err.errors);
    });
}

async function update(req, res, next) {
  let schema = yup.object().shape({
    name: rules.name,
  });

  schema
    .validate(req.body, { stripUnknown: true })
    .then((result) => {
      req.body = result;
      next();
    })
    .catch((err) => {
      return res.jsonBadRequest(null, null, err.toString());
    });
}

async function remove(req, res, next) {
  let schema = yup.object().shape({
    user_id: rules._id,
  });

  schema
    .validate(req.query, { stripUnknown: true })
    .then((result) => {
      if (decrypt(req.auth) !== user_id)
        return res.jsonBadRequest(null, null, null);
      req.query = result;
      next();
    })
    .catch((err) => {
      return res.jsonBadRequest(null, null, err.errors);
    });
}

export default {
  google_sign_up,
  sign_up,
  sign_in,
  findOne,
  list,
  update,
  remove,
};
