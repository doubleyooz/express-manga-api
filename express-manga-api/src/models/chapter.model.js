import mongoose from "mongoose";
import ImageSchema from "./image.model.js";
import { CHAPTER, IMAGE, REVIEW } from "../utils/constant.util.js";
import { deleteFiles } from "../utils/files.util.js";

const ChapterSchema = new mongoose.Schema(
  {
    manga_id: String,
    number: Number,
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
        //a array fill with the review ids
        type: mongoose.Schema.Types.ObjectId,
        ref: REVIEW,
      },
    ],
  },
  { timestamps: true }
)
  .pre("deleteMany", async function (next) {
    const chaptersToDelete = await this.model.find(this.getFilter());

    // Assuming deleteFiles is an asynchronous function that deletes the files
    // You might need to adjust this part based on how your deleteFiles function works
    const deletePromises = chaptersToDelete.flatMap((chapter) =>
      chapter.pages.map((page) => deleteFiles(page))
    );
    await Promise.all(deletePromises);

    next(); // Proceed with the actual deletion
  })

  .post("deleteOne", async function (doc) {
    await deleteFiles(doc.pages);
  });

export default mongoose.model(CHAPTER, ChapterSchema);
