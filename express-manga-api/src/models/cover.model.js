import mongoose from "mongoose";
import { COVER, MANGA } from "../utils/constant.util.js";

import ImageSchema from "./image.model.js";

const CoverSchema = new mongoose.Schema(
  {
    mangaId: {
      type: String,
      ref: MANGA,
    },
    volume: { type: Number },
    title: {
      type: String,
      default: "none",
    },
    files: ImageSchema,
    language: {
      type: String,
    },

  },
  { timestamps: true },
);

export default mongoose.model(COVER, CoverSchema);
