import { findOneById } from "../database/abstract.middleware.js";
import { BadRequestException } from "../utils/exception.util.js";
import { userRules as rules, validateBody } from "../utils/yup.util.js";

async function create(req, res, next) {
  try {
    const expectedBody = {
      email: rules.email,
      password: rules.password,
      name: rules.name.required(),
      role: rules.role.required(),
    };

    req.body = await validateBody({ ...req.body }, expectedBody, { abortEarly: false, stripUnknown: true });

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
      role: rules.role,
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
      name: rules.name,
    };

    req.body = await validateBody({ ...req.body }, expectedBody, { abortEarly: false, stripUnknown: true });

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
