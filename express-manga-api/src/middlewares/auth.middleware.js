import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import yup from "yup";

import { auth_rules, user_rules as rules } from "../utils/yup.util.js";

async function basicLogin(req, res, next) {
  const [hashType, hash] = req.headers?.authorization?.split(" ");
  if (hashType !== "Basic") {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ message: HttpStatusMessages.UNAUTHORIZED });
  }

  const [email, supposedPassword] = Buffer.from(hash, "base64")
    .toString()
    .split(":");

  const result = await yup
    .object({
      email: rules.email,
      password: rules.password,
    })
    .validate({ email, password: supposedPassword }, { abortEarly: false });

  req.body = result;

  next();
}

async function activateAccount(req, res, next) {
  try {
    const result = await yup
      .object({
        token: auth_rules.token.required(),
      })
      .validate(req.params, { stripUnknown: true });

    req.params = result;
    next();
  }
  catch (err) {
    console.log(err);
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json(err.inner.map(e => e.message));
  }
}

export default { basicLogin, activateAccount };
