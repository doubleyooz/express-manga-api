import mongoose from "mongoose";
import {
  AUTHOR,
  CHAPTER,
  COVER,
  languages,
  MANGA,
  mangaType,
  REVIEW,
  USER,
} from "../utils/constant.util.js";

const MangaSchema = new mongoose.Schema(
  {
    covers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: COVER,
    }],
    title: {
      type: String,
      unique: true,
    },
    writers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: AUTHOR,
    }],
    artists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: AUTHOR,
    }],
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
        enum: languages,
      },
    ],
    chapters: [
      {
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

    type: {
      type: String,
      enum: mangaType,
    },
  },
  { timestamps: true },
);

export default mongoose.model(MANGA, MangaSchema);
