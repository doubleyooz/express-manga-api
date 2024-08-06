import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["Reader", "Scan"],
      default: "Reader",
    },

    name: {
      type: String,
      required: true,
    },

    mangas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga",
      },
    ],

    subscribed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga",
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga",
      },
    ],

    tokenVersion: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: false,
    },

    resetLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
