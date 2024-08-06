import mongoose from "mongoose";
import ImageSchema from "./image.model.js";
import { CHAPTER, REVIEW } from "../utils/constant.util.js";

const ChapterSchema = new mongoose.Schema(
  {
    manga_id: String,
    number: Number,
    title: {
      type: String,
      default: "none",
    },
    //pages: Number,
    imgCollection: [ImageSchema],
    views: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
    },
    reviews: [
      {
        //a array fill with the review ids
        type: mongoose.Schema.Types.ObjectId,
        ref: REVIEW,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(CHAPTER, ChapterSchema);
