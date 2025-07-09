import { addYears, isBefore, isDate, isSameDay, isValid, parse, subYears } from "date-fns";
import mongoose from "mongoose";
import yup from "yup";
import {
  genres,
  languages,
  mangaType,
  SCAN,
  themes,
  USER,
} from "./constant.util.js";

import { getMessage } from "./message.util.js";

// Constants
const DATE_FORMATS = ["MM/dd/yyyy", "MM-dd-yyyy", "yyyy-MM-dd"];
const URL_REGEX = /^(?=.{4,2048}$)((http|https):\/\/)?(www.)?(?!.*(https|http|www.))[\w-]{1,63}(\.[a-zA-Z]{1,63}){1,5}(\/).([\w?[\-%/@]+)*([^/\w?[\-]+=\w+(&\w+=\w+)*)?$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
const NAME_REGEX = /^(\D*)$/;
const ROLE_REGEX = /^(scan|user)$/;
const AUTHOR_TYPE_REGEX = /^(writer|artist)$/;
const MANGA_TYPE_REGEX = /^(manga|manhwa|manhua)$/;
const NSFW_REGEX = /^(true|false)$/;

// Date parsing utility
function parseDateString(value, originalValue) {
  // Return early if already a valid date
  if (isDate(originalValue) && isValid(originalValue)) {
    return originalValue;
  }

  if (typeof originalValue !== "string") {
    return new Date("invalid");
  }

  // Try each date format
  for (const format of DATE_FORMATS) {
    const parsedDate = parse(originalValue, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // Fallback to native Date parsing
  const fallbackDate = new Date(originalValue);
  return isValid(fallbackDate) ? fallbackDate : new Date("invalid");
}

function isValidMongoIdRequired(value) {
  return (
    mongoose.Types.ObjectId.isValid(value)
    && String(new mongoose.Types.ObjectId(value)) === value
  );
}

function isValidMongoId(value) {
  if (value) {
    return mongoose.Types.ObjectId.isValid(value) && String(new mongoose.Types.ObjectId(value)) === value;
  }
  return true;
}

// Array validation utilities
function validateArrayItems(items, validOptions, transform = item => item.toLowerCase()) {
  if (!Array.isArray(items))
    return false;
  return items.every(item => validOptions.includes(transform(item)));
}

function hasNoDuplicates(array) {
  return new Set(array).size === array.length;
}

function transformToArray(value, originalValue) {
  if (Array.isArray(originalValue))
    return originalValue;
  if (typeof originalValue === "string")
    return [originalValue];
  return originalValue;
}

const mongoId = yup
  .string()
  .test("isValidMongoId", getMessage("invalid.object.id"), value =>
    isValidMongoId(value));

const mongoIdReq = yup
  .string()
  .required()
  .test("isValidMongoId", getMessage("invalid.object.id"), value =>
    isValidMongoIdRequired(value));

const languageValidator = yup
  .string()
  .default(languages[0])
  .test(
    "Valid language",
    "This value for ${path} is not a valid option",
    value => languages.includes(value?.toLowerCase()),
  );

const nameValidator = yup
  .string()
  .min(3)
  .max(20)
  .trim()
  .matches(NAME_REGEX, "no numbers allowed");

const titleValidator = yup.string().min(2).max(60).trim();

const tokenValidator = yup.string();

async function validateBody(body, expectedBody, validateOptions = { stripUnknown: true }) {
  return await yup
    .object({
      ...expectedBody,
    })
    .validate(body, validateOptions);
}

async function paramsIdResult(params) {
  return await yup
    .object({
      _id: mongoIdReq,
    })
    .validate(params, { stripUnknown: true });
}

const fileSchema = yup.object({
  fieldname: yup.string().required(),
  originalname: yup.string().required(),
  encoding: yup.string().required(),
  mimetype: yup.string().required(),
  size: yup.number().required(),
  destination: yup.string().required(),
  filename: yup.string().required(),
  path: yup.string().required(),
  buffer: yup.mixed().notRequired(),
});

const pagesRule = yup.array().of(fileSchema);
const pagesRequired = pagesRule.min(1, "At least one page is required");

const populate = yup.boolean().default(false);

const mangaRules = {
  title: titleValidator,
  genres: yup
    .array(yup.string())
    .min(3, "")
    .max(5, "")
    .test(
      "Valid genres",
      "Not all given ${path} are valid options",
      items => validateArrayItems(items, genres),
    ),
  themes: yup
    .array(yup.string())
    .min(3, "")
    .max(5, "")
    .test(
      "Valid themes",
      "Not all given ${path} are valid options",
      items => validateArrayItems(items, themes),
    ),
  synopsis: yup.string().min(10).max(400).trim(),
  nChapters: yup.number().min(1),
  status: yup
    .number()
    .min(1)
    .max(6),
  nsfw: yup.string().matches(NSFW_REGEX, null),
  type: yup
    .string()
    .matches(
      MANGA_TYPE_REGEX,
      null,
    )
    .default(mangaType[0]),
  languages: yup
    .array(yup.string())
    .min(1, "")
    .max(languages.length, "")
    .default([languages[0]])
    .test(
      "Valid languages",
      "Not all given ${path} are valid options",
      items => validateArrayItems(items, languages),
    ),
  artists: yup.array(mongoId),
  writers: yup.array(mongoId),
};

const authorRules = {
  types: yup
    .array()
    .of(
      yup
        .string()
        .lowercase()
        .matches(AUTHOR_TYPE_REGEX),
    )
    .ensure()
    .max(2, "Can not provide more than two types")
    .test("Has duplicates", "No duplicates are allow in ${path}", array => hasNoDuplicates(array),
    ),
  name: nameValidator,
  birthDate: yup
    .date()
    .transform(parseDateString)
    .max(subYears(new Date(), 5))
    .min(new Date(1900, 1, 1)),

  deathDate: yup
    .date()
    .transform(parseDateString)
    .when("birthDate", ([birthDate], schema) => {
      if (birthDate && isValid(birthDate)) {
        return schema
          .min(addYears(birthDate, 10))
          .max(addYears(birthDate, 101));
      }
      return schema;
    })
    .test({
      name: "valid-death-date",
      exclusive: false,
      message: "Death date cannot be in the future",
      test(value) {
        if (!value)
          return true; // nullable, so undefined/null is valid
        return isBefore(value, new Date()) || isSameDay(value, new Date());
      },
    }),
  socialMedia: yup
    .array(
      yup
        .string()
        .trim()
        .matches(
          URL_REGEX,
          "must be a valid url",
        ),
    )
    .transform((value, originalValue) => {
      // If it's already an array, return it
      if (Array.isArray(originalValue)) {
        return originalValue;
      }
      // If it's a string, wrap it in an array
      if (typeof originalValue === "string") {
        return [originalValue];
      }
      // For other types, return as-is (let Yup handle validation)
      return originalValue;
    })
    .min(1)
    .max(5),
  biography: yup.string().min(15).max(800).trim(),
};

const chapterRules = {
  title: titleValidator,
  number: yup.number().min(1),
  language: languageValidator,
};

const coverRules = {
  title: titleValidator,
  volume: yup.number().min(1),
  language: languageValidator,
};

const reviewRules = {
  rating: yup.number().min(0).max(5),
  text: yup.string().min(2).max(500).trim(),
};

const userRules = {
  email: yup.string().email().trim().required(),
  name: nameValidator,
  password: yup
    .string()
    .min(8)
    .matches(
      PASSWORD_REGEX,
      getMessage("user.invalid.password.weak"),
    )
    .required(),

  role: yup.string().matches(ROLE_REGEX, null),
  signInPassword: yup
    .string()
    .min(8)
    .required(),
};

export {
  authorRules,
  chapterRules,
  coverRules,
  mangaRules,
  mongoId,
  mongoIdReq,
  pagesRequired,
  pagesRule,
  paramsIdResult,
  populate,
  reviewRules,
  tokenValidator,
  userRules,
  validateBody,
};
