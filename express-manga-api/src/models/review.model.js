import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    text: String,
    rating: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manga",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
