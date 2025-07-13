import { abortTransaction, commitTransaction, endSession, findAll, findById, getSession, startTransaction, update } from "../database/abstract.repository.js";
import Chapter from "../models/chapter.model.js";
import Manga from "../models/manga.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import {
  ROLES,
} from "../utils/constant.util.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function create(data) {
  const session = await getSession();
  try {
    startTransaction(session);

    const newManga = await Manga.create({
      ...data,
    }).session(session);

    const currentUser = await User.findByIdAndUpdate(
      data.owner,
      { $push: { mangas: newManga[0]._id } },
      { session },
    );

    if (!currentUser || currentUser.role !== ROLES.SCAN) {
      throw new UnprocessableEntityException();
    }

    await commitTransaction(session);

    return newManga;
  }
  catch (err) {
    console.error("Error:", err);

    await abortTransaction(session);

    if (err instanceof UnprocessableEntityException)
      throw err;

    if (err.code === 11000) {
      throw new UnprocessableEntityException(getMessage("manga.error.twinned"));
    }

    throw new InternalServerErrorException(
      "Error while creating manga",
    );
  }
  finally {
    endSession(session);
  }
}

async function likeManga(mangaId, data, throwNotFound = true) {
  try {
    const document = await Manga.findByIdAndUpdate(
      mangaId,
      { $push: { likes: data.userId } },
    );

    if (!document && throwNotFound) {
      throw new NotFoundException();
    }

    return document;
  }
  catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

async function deleteById(mangaId, throwNotFound = true) {
  const session = await getSession();

  try {
    startTransaction(session);

    // 1. Find all chapters with their images
    const chapters = await Chapter.find({ mangaId }).session(session);
    console.log("Chapters found:", chapters.length);

    // 2. Delete all reviews
    const reviews = await Review.deleteMany({ mangaId }).session(session);
    console.log("Reviews found:", reviews.length);

    // 3. Delete chapters from database
    const deletedChapters = await Chapter.deleteMany({ mangaId }, { pages: 1 }).session(session);
    console.log("Chapters deleted:", deletedChapters.deletedCount);

    // 4. Delete manga from database
    const document = await Manga.findByIdAndDelete(mangaId, { covers: 1 }).session(session);
    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }
    console.log("Manga deleted:", document ? document.title : "Not found");

    // 5. Delete manga from user list
    const mangaOwner = await User.findByIdAndUpdate(
      document.owner,
      { $pull: { mangas: mangaId } },
      { session },
    );

    if (!mangaOwner) {
      throw new UnprocessableEntityException();
    }

    // 6. Collect all image files to delete
    const allImages = chapters.flatMap(chapter => chapter.files).concat(document.covers);

    console.log({ chapters, document });

    console.log("Total images to delete:", allImages.length);

    // 7. Commit transaction first
    await commitTransaction(session);

    // 8. Delete files AFTER successful DB operations
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
    console.error("Error:", error);
    await abortTransaction(session);
    throw error;
  }
  finally {
    endSession(session);
  }
}

export default {

  create,
  findById: id => findById(Manga, id),
  findAll: (filter, populate = null) => findAll(Manga, filter, populate),
  update: (filter, data) => update(Manga, filter, data),
  deleteById,
  likeManga,
};
