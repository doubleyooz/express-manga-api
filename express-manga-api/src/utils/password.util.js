import { createCipheriv, createDecipheriv } from "node:crypto";
import * as bcrypt from "bcrypt";

import env from "../env.js";

export async function hashPassword(password, salt) {
  return await bcrypt.hash(
    password,
    salt || bcrypt.genSaltSync(Number.parseInt(env.BCRYPT_SALT)),
  );
}

export async function matchPassword(password, supposedPassword) {
  return await bcrypt.compare(supposedPassword, password);
}

export function encrypt(val) {
  const cipher = createCipheriv(
    env.ALGORITHM,
    Buffer.from(env.ENC_KEY, "hex"),
    Buffer.from(env.IV, "hex"),
  );
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export function decrypt(encrypted) {
  const decipher = createDecipheriv(
    env.ALGORITHM,
    Buffer.from(env.ENC_KEY, "hex"),
    Buffer.from(env.IV, "hex"),
  );

  return decipher.update(encrypted, "base64", "utf8");
}
