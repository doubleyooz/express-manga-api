import mongoose from "mongoose";
import { AUTHOR, MANGA } from "../utils/constant.util.js";
import ImageSchema from "./image.model.js";

const AuthorSchema = new mongoose.Schema(
  {
    types: [
      {
        type: String,
      },
    ],

    files: [ImageSchema],

    name: {
      type: String,
      required: true,
      unique: true,
    },

    birthDate: {
      type: Date,
    },

    deathDate: {
      type: Date,
    },

    mangas: [
      {
        // a array fill with the manga ids
        type: mongoose.Schema.Types.ObjectId,
        ref: MANGA,
      },
    ],

    biography: {
      type: String,
    },

    socialMedia: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model(AUTHOR, AuthorSchema);
