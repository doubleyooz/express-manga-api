import mongoose from "mongoose";
import { CHAPTER, IMAGE, MANGA, REVIEW } from "../utils/constant.util.js";
import { deleteFiles } from "../utils/files.util.js";
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
    pages: [ImageSchema],
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
)
  .pre("deleteMany", async function (next) {
    const chaptersToDelete = await this.model.find(this.getFilter());

    // Assuming deleteFiles is an asynchronous function that deletes the files
    // You might need to adjust this part based on how your deleteFiles function works
    const deletePromises = chaptersToDelete.flatMap(chapter =>
      chapter.pages.map(page => deleteFiles(page)),
    );
    await Promise.all(deletePromises);

    next(); // Proceed with the actual deletion
  })

  .post("findOneAndDelete", async (doc) => {
    console.log("findOneAndDelete", doc);
    if (doc?.deletedCount === 0)
      return;
    await deleteFiles(doc.pages);
  });

export default mongoose.model(CHAPTER, ChapterSchema);
