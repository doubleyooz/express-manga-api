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

function parseDateString(value, originalValue) {
  // If it's already a valid date, return it
  if (isDate(originalValue) && isValid(originalValue)) {
    return originalValue;
  }

  if (typeof originalValue === "string") {
    // Try MM/DD/YYYY format (based on your example)
    let parsedDate = parse(originalValue, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      return parsedDate;
    }

    parsedDate = parse(originalValue, "MM-dd-yyyy", new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }

    parsedDate = parse(originalValue, "yyyy-MM-dd", new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }

    // Fallback to native Date parsing
    parsedDate = new Date(originalValue);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return new Date("invalid");
}

const auth_rules = {
  token: yup.string(),
};

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
const mongo_id = yup
  .string()
  .test("isValidMongoId", getMessage("invalid.object.id"), value =>
    isValidMongoId(value));
const mongo_id_req = yup
  .string()
  .test("isValidMongoId", getMessage("invalid.object.id"), value =>
    isValidMongoIdRequired(value));

const name = yup
  .string()
  .min(3)
  .max(20)
  .trim()
  .matches(/^(\D*)$/, "no numbers allowed");

const pages_rule = yup
  .array()
  .of(
    yup.object({
      fieldname: yup.string().required(),
      originalname: yup.string().required(),
      encoding: yup.string().required(),
      mimetype: yup.string().required(),
      size: yup.number().required(),
      destination: yup.string().required(),
      filename: yup.string().required(),
      path: yup.string().required(),
      buffer: yup.mixed().notRequired(), // buffer may not always be present
    }),
  );

const populate = yup.boolean().default(false);

const manga_rules = {
  title: yup.string().min(2).max(60).trim(),
  genres: yup
    .array(yup.string())
    .min(3, "")
    .max(5, "")
    .test(
      "Valid genres",
      "Not all given ${path} are valid options",
      (items) => {
        if (items) {
          return items.every((item) => {
            return genres.includes(item.toLowerCase());
          });
        }

        return false;
      },
    ),
  themes: yup
    .array(yup.string())
    .min(3, "")
    .max(5, "")
    .test(
      "Valid themes",
      "Not all given ${path} are valid options",
      (items) => {
        if (items) {
          return items.every((item) => {
            return themes.includes(item.toLowerCase());
          });
        }
        return false;
      },
    ),
  covers: pages_rule,
  covers_required: pages_rule.min(1, "At least one page is required"),
  synopsis: yup.string().min(10).max(400).trim(),
  nChapters: yup.number().min(1),
  status: yup
    .number()
    .min(1, getMessage("manga.invalid.code"))
    .max(6, getMessage("manga.invalid.code")),
  nsfw: yup.string().matches(/(true|false)/, null),
  type: yup
    .string()
    .matches(
      new RegExp(`${mangaType[0]}|${mangaType[1]}|${mangaType[2]}`),
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
      (items) => {
        if (items) {
          return items.every((item) => {
            return languages.includes(item.toLowerCase());
          });
        }
        return false;
      },
    ),

  _id: mongo_id_req,
  id_not_required: mongo_id,
  artists: yup.array(mongo_id),
  writers: yup.array(mongo_id),
};

const author_rules = {
  types: yup
    .array()
    .of(
      yup
        .string()
        .lowercase()
        .matches(/(^writer$|^artist$)/),
    )
    .ensure()
    .max(2, "Can not provide more than two types")
    .test("Has duplicates", "No duplicates are allow in ${path}", (array) => {
      return !(new Set(array).size !== array.length);
    }),
  _id: mongo_id_req,
  name,
  imgCollection: pages_rule,
  imgCollection_required: pages_rule.min(1, "At least one page is required"),
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
          /^(?=.{4,2048}$)((http|https):\/\/)?(www.)?(?!.*(https|http|www.))[\w-]{1,63}(\.[a-zA-Z]{1,63}){1,5}(\/).([\w?[\-%/@]+)*([^/\w?[\-]+=\w+(&\w+=\w+)*)?$/,
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

const chapter_rules = {
  id_not_required: mongo_id,
  _id: mongo_id_req,
  mangaId: yup.string().max(60),
  title: yup.string().min(2).max(40).trim(),
  number: yup.number().min(1),
  pages: pages_rule,
  pages_required: pages_rule.min(1, "At least one page is required"),
  language: yup
    .string()
    .default("pt")
    .test(
      "Valid language",
      "This value for ${path} is not a valid option",
      (value) => {
        return languages.includes(value.toLowerCase());
      },
    ),
};

const cover_rules = {
  id_not_required: mongo_id,
  _id: mongo_id_req,
  mangaId: yup.string().max(60),
  title: yup.string().min(2).max(40).trim(),
  volume: yup.number().min(1),
  pages: pages_rule,
  pages_required: pages_rule.min(1, "At least one page is required"),
  language: yup
    .string()
    .default("pt")
    .test(
      "Valid language",
      "This value for ${path} is not a valid option",
      (value) => {
        return languages.includes(value.toLowerCase());
      },
    ),
};

const review_rules = {
  _id: mongo_id_req,
  id_not_required: mongo_id,
  rating: yup.number().min(0).max(5),
  text: yup.string().min(2).max(500).trim(),
};

const user_rules = {
  _id: mongo_id_req,
  email: yup.string().email().trim().required(),
  name,
  password: yup
    .string()
    .min(8, getMessage("user.invalid.password.short"))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      getMessage("user.invalid.password.weak"),
    )
    .required(),

  role: yup.string().matches(new RegExp(`(${SCAN}|${USER})`), null),
  sign_in_password: yup
    .string()
    .min(8, getMessage("user.invalid.password.short"))
    .required(),
};

export {
  auth_rules,
  author_rules,
  chapter_rules,
  cover_rules,
  manga_rules,
  populate,
  review_rules,
  user_rules,
};
