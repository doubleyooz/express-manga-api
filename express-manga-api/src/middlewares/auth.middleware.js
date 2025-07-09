import yup from "yup";
import { UnauthorisedException } from "../utils/exception.util.js";
import { userRules as rules, tokenValidator } from "../utils/yup.util.js";

async function basicLogin(req, res, next) {
  try {
    const { email, supposedPassword } = req.body;

    const result = await yup
      .object({
        email: rules.email,
        password: rules.password,
      })
      .validate({ email, password: supposedPassword }, { abortEarly: false });

    req.body = result;

    next();
  }
  catch (err) {
    next(err);
  }
}

async function activateAccount(req, res, next) {
  try {
    const result = await yup
      .object({
        token: tokenValidator.required(),
      })
      .validate(req.params, { stripUnknown: true });

    req.params = result;
    next();
  }
  catch (err) {
    next(new UnauthorisedException(err));
  }
}

export default { basicLogin, activateAccount };
