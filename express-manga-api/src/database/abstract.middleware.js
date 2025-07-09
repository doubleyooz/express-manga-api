import { BadRequestException } from "../utils/exception.util.js";
import { paramsIdResult } from "../utils/yup.util.js";

async function findOneById(req, res, next) {
  try {
    req.params = await paramsIdResult(req.params);
    next();
  }
  catch (err) {
    next(new BadRequestException(err.errors));
  }
}

export { findOneById };
