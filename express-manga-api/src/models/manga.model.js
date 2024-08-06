import mongoose from "mongoose";
import ImageSchema from "./image.model.js";
import {
  AUTHOR,
  CHAPTER,
  MANGA,
  REVIEW,
  USER,
} from "../utils/constant.util.js";

const MangaSchema = new mongoose.Schema(
  {
    imgCollection: [ImageSchema],
    title: {
      type: String,
      unique: true,
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: AUTHOR,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: AUTHOR,
    },
    genres: [
      {
        type: String,
      },
    ],
    themes: [
      {
        type: String,
      },
    ],
    type: String,
    synopsis: String,
    nChapters: {
      type: Number,
      default: 0,
    },
    status: Number,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
      },
    ],
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
      },
    ],
    nsfw: {
      type: Boolean,
      default: false,
    },
    languages: [
      {
        type: String,
      },
    ],
    chapters: [
      {
        //a array fill with the data links
        type: mongoose.Schema.Types.ObjectId,
        ref: CHAPTER,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },

    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: REVIEW,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(MANGA, MangaSchema);
