import mongoose from "mongoose";
import { CHAPTER, MANGA, REVIEW } from "../utils/constant.util.js";

import ImageSchema from "./image.model.js";

const ChapterSchema = new mongoose.Schema(
  {
    mangaId: {
      type: String,
      ref: MANGA,
    },
    number: { type: Number },
    title: {
      type: String,
      default: "none",
    },
    files: [ImageSchema],
    views: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
    },
    reviews: [
      {
        // a array fill with the review ids
        type: mongoose.Schema.Types.ObjectId,
        ref: REVIEW,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model(CHAPTER, ChapterSchema);
