import mongoose from "mongoose";
import { MANGA, ROLES, USER } from "../utils/constant.util.js";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: [ROLES.READER, ROLES.SCAN],
      default: ROLES.READER,
    },

    name: {
      type: String,
      required: true,
    },

    mangas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MANGA,
      },
    ],

    subscribed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MANGA,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
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
  { timestamps: true },
);

export default mongoose.model(USER, UserSchema);
