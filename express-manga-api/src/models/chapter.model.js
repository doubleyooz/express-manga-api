import mongoose from "mongoose";
import ImageSchema from "./image.model.js";

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
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chapter", ChapterSchema);
