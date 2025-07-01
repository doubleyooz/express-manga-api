import mongoose from "mongoose";
import {
  AUTHOR,
  CHAPTER,
  IMAGE,
  languages,
  MANGA,
  mangaType,
  REVIEW,
  USER,
} from "../utils/constant.util.js";
import chapterModel from "./chapter.model.js";
import ImageSchema from "./image.model.js";

const MangaSchema = new mongoose.Schema(
  {
    covers: [ImageSchema],
    title: {
      type: String,
      unique: true,
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: AUTHOR,
      required: false,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: AUTHOR,
      required: false,
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
).post("findOneAndDelete", async (doc) => {
  console.log("findOneAndDelete", doc);
  const mangaId = doc._id;
  await chapterModel.deleteMany({ mangaId });
});

export default mongoose.model(MANGA, MangaSchema);
