import mongoose from "mongoose";
import { findAll, findById, update } from "../database/abstract.repository.js";
import Manga from "../models/manga.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(data) {
  console.log("Creating review with data:", data);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const doesMangaExist = await Manga.exists({ _id: data.mangaId });
    if (!doesMangaExist) {
      throw new NotFoundException();
    }
    const newReview = await Review.create([{ ...data }], { session });
    await Manga.findByIdAndUpdate(
      data.mangaId,
      { $push: { reviews: newReview[0]._id } },
      { session },
    );
    await session.commitTransaction();
    return newReview[0];
  }
  catch (err) {
    await session.abortTransaction();
    await deleteFiles(data.files);
    if (err.name === NotFoundException.name)
      throw new NotFoundException();

    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("review.error.twinned"),
      );
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while creating review",
    });
  }
  finally {
    session.endSession();
  }
}

async function deleteById(_id, throwNotFound = true) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const document = await Review.findByIdAndDelete({ _id }).exec();

    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }

    await Manga.findByIdAndUpdate(
      document.mangaId,
      { $pull: { reviews: document._id } },
      { session },
    );

    await User.findByIdAndUpdate(
      document.userId,
      { $pull: { reviews: document._id } },
      { session },
    );

    await session.commitTransaction();
    console.log("Transaction committed successfully");

    return document;
  }
  catch (err) {
    await session.abortTransaction();
    if (err.name === NotFoundException.name && throwNotFound) {
      throw new NotFoundException();
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while deleting review",
    });
  }
  finally {
    session.endSession();
  }
}

export default {
  create,
  findById: id => findById(Review, id),
  findAll: (filter, populate = null) => findAll(Review, filter, populate),
  update: (filter, data) => update(Review, filter, data),
  deleteById,
};
