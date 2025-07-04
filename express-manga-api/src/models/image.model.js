import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    size: Number,
    filename: {
      type: String,
    },
    destination: {
      type: String,
    },

    mimetype: String,
  },
  { _id: false, timestamps: true },
);
