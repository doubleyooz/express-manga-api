import yup from "yup";
import { BadRequestException } from "../utils/exception.util.js";
import { mongoIdReq } from "../utils/yup.util.js";

async function findOneById(req, res, next) {
  try {
    const result = await yup
      .object({
        _id: mongoIdReq,
      })
      .validate(req.params, { stripUnknown: true });

    req.params = result;
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

export { findOneById };
