import mongoose from "mongoose";
import yup from "yup";
import { parseISO, isDate, addYears, subYears, isBefore } from "date-fns";
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
  const parsedDate = isDate(originalValue)
    ? new Date(originalValue)
    : parseISO(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
}

const auth_rules = {
  token: yup.string(),
};

function isValidMongoIdRequired(value) {
  return (
    mongoose.Types.ObjectId.isValid(value) &&
    String(new mongoose.Types.ObjectId(value)) === value
  );
}

function isValidMongoId(value) {
  if (!!value) {
    mongoose.Types.ObjectId.isValid(value) &&
      String(new mongoose.Types.ObjectId(value)) === value;
  }
  return true;
}
const mongo_id = yup
  .string()
  .test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
    isValidMongoId(value)
  );
const mongo_id_req = yup
  .string()
  .test("isValidMongoId", getMessage("invalid.object.id"), (value) =>
    isValidMongoIdRequired(value)
  );

const name = yup
  .string()
  .min(3)
  .max(20)
  .trim()
  .matches(/^([^0-9]*)$/, "no numbers allowed");

const manga_rules = {
  title: yup.string().min(2).max(60).trim(),
  genres: yup
    .array(yup.string())
    .min(3, "")
    .max(5, "")
    .test(
      "Valid genres",
      "Not all given ${path} are valid options",
      function (items) {
        if (items) {
          return items.every((item) => {
            return genres.includes(item.toLowerCase());
          });
        }

        return false;
      }
    ),
  themes: yup
    .array(yup.string())
    .min(3, "")
    .max(5, "")
    .test(
      "Valid themes",
      "Not all given ${path} are valid options",
      function (items) {
        if (items) {
          return items.every((item) => {
            return themes.includes(item.toLowerCase());
          });
        }
        return false;
      }
    ),

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
      null
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
      function (items) {
        if (items) {
          return items.every((item) => {
            return languages.includes(item.toLowerCase());
          });
        }
        return false;
      }
    ),

  _id: mongo_id_req,
  id_not_required: mongo_id,
  artistId: mongo_id,
  writerId: mongo_id,
};

const author_rules = {
  types: yup
    .array()
    .of(
      yup
        .string()
        .lowercase()
        .matches(/(^writer$|^artist$)/)
    )
    .ensure()
    .min(1, "Need to provide at least one type")
    .max(2, "Can not provide more than two types")
    .test("Has duplicates", "No duplicates are allow in ${path}", (array) => {
      return !(new Set(array).size !== array.length);
    }),
  _id: mongo_id_req,
  name: name,

  birthDate: yup
    .date()
    .transform(parseDateString)
    .max(subYears(new Date(), 5))
    .min(new Date(1900, 1, 1)),

  deathDate: yup
    .date()
    .transform(parseDateString)
    .nullable()
    .when(
      "birthDate",
      (birthDate, yup) => birthDate && yup.min(addYears(birthDate, 10))
    )
    .when(
      "birthDate",
      (birthDate, yup) => birthDate && yup.max(addYears(birthDate, 101))
    )
    .test({
      name: "Valid ${path}",
      exclusive: false,
      params: {},
      message: "This is not a valid value for ${path}",
      test: (value) =>
        !value ||
        // You can access the price field with `this.parent`.
        isBefore(value, new Date()),
    }),
  socialMedia: yup
    .array(
      yup
        .string()
        .trim()
        .matches(
          /^(?=.{4,2048}$)((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]{1,63}(\.[a-zA-Z]{1,63}){1,5}(\/){1}.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
          "must be a valid url"
        )
    )
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

  language: yup
    .string()
    .default("pt")
    .test(
      "Valid language",
      "This value for ${path} is not a valid option",
      (value) => {
        return languages.includes(value.toLowerCase());
      }
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
  name: name,
  password: yup
    .string()
    .min(8, getMessage("user.invalid.password.short"))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      getMessage("user.invalid.password.weak")
    )
    .required(),

  role: yup.string().matches(new RegExp(`(${SCAN}|${USER})`), null),
  sign_in_password: yup
    .string()
    .min(8, getMessage("user.invalid.password.short"))
    .required(),
};

export {
  manga_rules,
  auth_rules,
  author_rules,
  user_rules,
  chapter_rules,
  review_rules,
};
