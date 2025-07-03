import mongoose from "mongoose";
import Chapter from "../models/chapter.model.js";
import Manga from "../models/manga.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function createManga(data) {
  try {
    const newManga = await Manga.create({
      ...data,
    });

    return newManga;
  }
  catch (err) {
    console.log(err);
    if (err.code === "11000") {
      throw new UnprocessableEntityException(getMessage("manga.error.twinned"));
    }
    throw new InternalServerErrorException({
      code: err.code,
      msg: "Error while creating manga",
    });
  }
}

async function findById(id) {
  const document = await Manga.findById(id).exec();
  if (!document) {
    throw new NotFoundException(getMessage("manga.notfound"));
  }
  return document;
}

async function findAll(filter, populate = false) {
  let queryOptions = {};

  // Check if filter is empty
  if (Object.keys(filter).length > 0 && filter.constructor === Object) {
    queryOptions = { ...filter };
  }

  const result = await Manga.find(queryOptions).populate(populate ? "chapter" : null);

  if (result.length === 0) {
    throw new NotFoundException(getMessage("manga.list.empty"));
  }

  return result;
}

async function updateManga(filter, data) {
  const document = await Manga.findOneAndUpdate({ ...filter }, data);
  if (!document) {
    throw new NotFoundException(getMessage("manga.notfound"));
  }
  return document;
}

async function deleteById(mangaId, throwNotFound = true) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find all chapters with their images
    const chapters = await Chapter.find({ mangaId }).session(session);

    // 3. Delete chapters from database
    await Chapter.deleteMany({ mangaId }).session(session);

    // 4. Delete manga from database
    const document = await Manga.findByIdAndDelete(mangaId).session(session);
    if (document === null && throwNotFound) {
      throw new NotFoundException(getMessage("manga.notfound"));
    }

    // 2. Collect all image files to delete
    const allImages = chapters.flatMap(chapter => chapter.pages).concat(document.covers);

    // 5. Commit transaction first
    await session.commitTransaction();

    // 6. Delete files AFTER successful DB operations
    if (allImages.length > 0) {
      try {
        await deleteFiles(allImages);
      }
      catch (fileError) {
        console.error("File deletion failed:", fileError);
        // Log but don't throw - DB is already consistent
      }
    }

    return { deletedManga: document, deletedChapters: chapters.length };
  }
  catch (error) {
    await session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
}

export default {
  createManga,
  findById,
  findAll,
  updateManga,
  deleteById,
};
