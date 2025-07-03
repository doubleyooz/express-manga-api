import jwt from "jsonwebtoken";
import env from "../env.js";

import { decrypt, encrypt } from "../utils/password.util.js";

const tokenPrivateKey = env.JWT_ID;
const refreshTokenPrivateKey = env.JWT_REFRESH_ID;

const accActivatePrivateKey = env.JWT_ACTIVATE_ACCESS;
const recoverPassPrivateKey = env.JWT_RECOVER_ACCESS;
const updateEmailPrivateKey = env.JWT_UPDATE_ACCESS;
const updatePasswordPrivateKey = env.JWT_UPDATE_PASSWORD;

const options = { expiresIn: env.ACCESS_TOKEN_EXPIRATION };
const refreshOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRATION };

const tokens = [
  [tokenPrivateKey, options],
  [refreshTokenPrivateKey, refreshOptions],
  [accActivatePrivateKey, options],
  [recoverPassPrivateKey, options],
  [updateEmailPrivateKey, options],
  [updatePasswordPrivateKey, options],
];

export const ACCESS_TOKEN_SECRET_INDEX = 1;
export const REFRESH_TOKEN_SECRET_INDEX = 2;
export const ACTIVATE_ACC_TOKEN_SECRET_INDEX = 3;
export const RECOVER_PASS_TOKEN_SECRET_INDEX = 4;
export const UPDATE_EMAIL_TOKEN_SECRET_INDEX = 5;
export const UPDATE_PASS_TOKEN_SECRET_INDEX = 6;

function generateJwt(payload, num = 1) {
  const [key, options] = tokens[num - 1];

  const jsonString = JSON.stringify(payload, null, 2);
  console.log({ jsonString, payload, options });
  return jwt.sign({ data: encrypt(jsonString) }, key, options);
}

function verifyJwt(token, num = 1) {
  console.log({ token, num });
  const [key] = tokens[num - 1];
  console.log({ key });
  const payload = JSON.parse(decrypt(jwt.verify(token, key).data));
  console.log({ payload });
  const current_time = Date.now().valueOf() / 1000;
  let newToken = null;
  if ((payload.exp - payload.iat) / 2 > payload.exp - current_time) {
    newToken = generateJwt({
      id: payload._id,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
    });
  }

  return [payload, newToken];
}

function getBearerToken(req, isBasicAuth = false) {
  const authHeader = req.headers.authorization; // Get the Authorization header
  if (!authHeader)
    return null; // If no header, return null

  const [hashType, token] = authHeader.split(" ");
  if (hashType !== "Basic" && isBasicAuth) {
    return null;
  }

  return token || null;
}

export default {
  verifyJwt,
  generateJwt,
  getBearerToken,
};
