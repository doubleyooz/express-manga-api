/* eslint-disable node/no-process-env */
import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import yup from "yup";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

const EnvSchema = yup.object({
  NODE_ENV: yup.string().default("development"),
  PORT: yup.number().default(9999),
  LOG_LEVEL: yup.mixed().oneOf(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),

  ACCESS_TOKEN_EXPIRATION: yup.string().default("1800s"),
  REFRESH_TOKEN_EXPIRATION: yup.string().default("9000s"),

  BCRYPT_SALT: yup.number().default(10),
  REFRESH_TOKEN_SECRET: yup.string().required(),
  // Remove hardcoded credentials - use environment variable
  DB_CONNECTION: yup.string().required(),

  // Add DATABASE_AUTH_TOKEN to schema since you're checking for it
  DATABASE_AUTH_TOKEN: yup.string().when("NODE_ENV", {
    is: "production",
    then: schema => schema.required("Must be set when NODE_ENV is 'production'"),
    otherwise: schema => schema.optional(),
  }),

  JWT_ID: yup.string().required(),
  JWT_REFRESH_ID: yup.string().required(),
  JWT_ACTIVATE_ACCESS: yup.string().required(),
  JWT_RECOVER_ACCESS: yup.string().required(),
  JWT_UPDATE_ACCESS: yup.string().required(),
  JWT_UPDATE_PASSWORD: yup.string().required(),

  ALGORITHM: yup.string().default("aes-256-gcm"),
  ENC_KEY: yup.string().required(),
  IV: yup.string().required(),
});

function initialiseEnv() {
  try {
    // validateSync either returns validated data or throws an error
    return EnvSchema.validateSync(process.env, {
      abortEarly: false, // Collect all errors
      stripUnknown: true, // Remove unknown properties
    });
  }
  catch (error) {
    console.error("❌ Invalid env:");
    if (error.inner && error.inner.length > 0) {
      // Format yup validation errors
      const fieldErrors = {};
      error.inner.forEach((err) => {
        fieldErrors[err.path] = err.message;
      });
      console.error(JSON.stringify(fieldErrors, null, 2));
    }
    else {
      console.error(error.message);
    }
    process.exit(1);
  }
}
const env = initialiseEnv();

export default env;
