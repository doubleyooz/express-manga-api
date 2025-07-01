import mongoose from "mongoose";
import { MANGA, REVIEW, USER } from "../utils/constant.util.js";

const ReviewSchema = new mongoose.Schema(
  {
    text: String,
    rating: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MANGA,
    },
  },
  { timestamps: true },
);

export default mongoose.model(REVIEW, ReviewSchema);
