import mongoose from "mongoose";
import yup from "yup";
import { parseISO, isDate, addYears, subYears, isBefore } from "date-fns";
import { SCAN, USER } from "../utils/constant.util.js";

import { getMessage } from "../utils/message.util.js";

const genres = [
  "action",
  "adventure",
  "boys' love",
  "comedy",
  "crime",
  "drama",
  "fantasy",
  "girls' love",
  "historical",
  "horror",
  "isekai",
  "magical girls",
  "mecha",
  "medical",
  "mystery",
  "philosophical",
  "psychological",
  "romance",
  "sci-fi",
  "slice of life",
  "sports",
  "superhero",
  "thriller",
  "tragedy",
  "wuxia",
];

const themes = [
  "aliens",
  "animals",
  "cooking",
  "crossdressing",
  "deliquents",
  "demons",
  "genderswap",
  "ghosts",
  "gyaru",
  "harem",
  "incest",
  "loli",
  "mafia",
  "magic",
  "martial arts",
  "military",
  "monster girls",
  "monsters",
  "music",
  "ninja",
  "office workers",
  "police",
  "post-apocalyptic",
  "reincarnation",
  "reverse harem",
  "samurai",
  "school life",
  "shota",
  "supernatural",
  "survival",
  "time travel",
  "traditional games",
  "vampires",
  "video games",
  "villainess",
  "virtual reality",
  "zombies",
];

const languages = [
  "da",
  "nl",
  "en",
  "fi",
  "fr",
  "de",
  "hu",
  "it",
  "nb",
  "pt",
  "ro",
  "ru",
  "tr",
  "es",
];

function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? new Date(originalValue)
    : parseISO(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
}

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
  n_chapters: yup.number().min(1),
  status: yup
    .number()
    .min(1, getMessage("manga.invalid.code"))
    .max(6, getMessage("manga.invalid.code")),
  nsfw: yup.string().matches(/(true|false)/, null),
  type: yup
    .string()
    .matches(/^manga$|^manhwa$|^manhua$/, null)
    .default({ type: "manga" }),
  languages: yup
    .array(yup.string())
    .min(1, "")
    .max(languages.length, "")
    .default(["pt"])
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
  artist_id: mongo_id_req,
  writer_id: mongo_id_req,
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
  manga_id: yup.string().max(60),
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

export { manga_rules, author_rules, user_rules, chapter_rules, review_rules };
