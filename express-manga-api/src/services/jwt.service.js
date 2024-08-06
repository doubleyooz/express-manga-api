import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "../utils/password.util.js";

const tokenPrivateKey = `${process.env.JWT_ID}`;
const refreshTokenPrivateKey = `${process.env.JWT_REFRESH_ID}`;

const accActivatePrivateKey = `${process.env.JWT_ACTIVATE_ACCESS}`;
const recoverPassPrivateKey = `${process.env.JWT_RECOVER_ACCESS}`;
const updateEmailPrivateKey = `${process.env.JWT_UPDATE_ACCESS}`;
const updatePasswordPrivateKey = `${process.env.JWT_UPDATE_PASSWORD}`;

const options = { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` };
const refreshOptions = { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION}` };

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

function verifyJwt(token, num) {
  const [key] = tokens[num - 1];

  return JSON.parse(decrypt(jwt.verify(token, key).data));
}

export default {
  verifyJwt,
  generateJwt,
};
