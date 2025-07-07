import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import mongoose from "mongoose";
import Author from "../models/author.model.js";
import Manga from "../models/manga.model.js";
import {
  CustomException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function createAuthor(data) {
  try {
    const newAuthor = await Author.create({
      ...data,
    });

    return newAuthor[0];
  }
  catch (err) {
    await deleteFiles(data.imgCollection);

    if (err.code === 11000) {
      throw new UnprocessableEntityException(getMessage("author.error.twinned"));
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while creating author",
    });
  }
}

async function findById(id) {
  const document = await Author.findById(id).exec();
  if (!document) {
    throw new NotFoundException(HttpStatusMessages.NOT_FOUND);
  }
  return document;
}

async function findAll(filter, populate = false) {
  let queryOptions = {};

  // Check if filter is empty
  if (Object.keys(filter).length > 0 && filter.constructor === Object) {
    queryOptions = { ...filter };
  }

  const result = await Author.find(queryOptions).populate(populate ? "mangas" : null);

  if (result.length === 0) {
    throw new NotFoundException(getMessage("author.list.empty"));
  }

  return result;
}

// how to update the files?
async function updateAuthor(filter, data) {
  const document = await Author.findOneAndUpdate({ ...filter }, data);
  if (!document) {
    throw new NotFoundException(HttpStatusMessages.NOT_FOUND);
  }
  return document;
}

async function deleteById(authorId, throwNotFound = true) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find all chapters with their images
    const document = await Author.findByIdAndDelete(authorId).session(session);

    if (!document && throwNotFound) {
      throw new NotFoundException();
    }

    document.mangas.forEach(async (mangaId) => {
      await Manga.findByIdAndUpdate(
        mangaId,
        { $pull: { writers: document._id, artists: document._id } },
        { session },
      );
    });
    // 4. Collect all image files to delete
    const allImages = document.imgCollection;

    console.log({ document });

    console.log("Total images to delete:", allImages.length);

    // 5. Commit transaction first
    await session.commitTransaction();
    console.log("Transaction committed successfully");

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

    return document;
  }
  catch (error) {
    console.error("Error:", error);
    await session.abortTransaction();
    if (error instanceof CustomException) {
      throw new NotFoundException(HttpStatusMessages.NOT_FOUND);
    }
    throw error;
  }
  finally {
    session.endSession();
  }
}

export default {
  createAuthor,
  findById,
  findAll,
  updateAuthor,
  deleteById,
};
