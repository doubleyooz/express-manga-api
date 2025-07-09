import mongoose from "mongoose";
import { findAll, findById, update } from "../database/abstract.repository.js";
import Chapter from "../models/chapter.model.js";
import Manga from "../models/manga.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(data) {
  console.log("Creating chapter with data:", data);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const doesMangaExist = await Manga.exists({ _id: data.mangaId });
    if (!doesMangaExist) {
      throw new NotFoundException();
    }
    const newChapter = await Chapter.create([{ ...data }], { session });
    await Manga.findByIdAndUpdate(
      data.mangaId,
      { $push: { chapters: newChapter[0]._id } },
      { session },
    );
    await session.commitTransaction();
    return newChapter[0];
  }
  catch (err) {
    await session.abortTransaction();
    await deleteFiles(data.files);
    if (err.name === NotFoundException.name)
      throw new NotFoundException();

    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("chapter.error.twinned"),
      );
    }
    throw new InternalServerErrorException("Error while creating chapter");
  }
  finally {
    session.endSession();
  }
}

async function deleteById(_id, throwNotFound = true) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const document = await Chapter.findByIdAndDelete({ _id }).exec();

    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }

    await Manga.findByIdAndUpdate(
      document.mangaId,
      { $pull: { chapters: document._id } },
      { session },
    );

    await session.commitTransaction();
    console.log("Transaction committed successfully");

    const allImages = document.files;
    // 6. Delete files AFTER successful DB operations
    if (allImages.length > 0) {
      try {
        await deleteFiles(allImages);
      }
      catch (fileError) {
        console.error("File deletion failed:", fileError);
      }
    }

    return document;
  }
  catch (err) {
    await session.abortTransaction();
    if (err.name === NotFoundException.name && throwNotFound) {
      throw new NotFoundException();
    }
    throw new InternalServerErrorException("Error while deleting chapter");
  }
  finally {
    session.endSession();
  }
}

export default {
  create,
  findById: id => findById(Chapter, id),
  findAll: (filter, populate = null) => findAll(Chapter, filter, populate),
  update: (filter, data) => update(Chapter, filter, data),
  deleteById,
};
