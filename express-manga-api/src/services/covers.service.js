import mongoose from "mongoose";
import Cover from "../models/cover.model.js";
import Manga from "../models/manga.model.js";
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../utils/exception.util.js";
import { deleteFiles } from "../utils/files.util.js";
import { getMessage } from "../utils/message.util.js";

async function createCover(data) {
  console.log("Creating cover with data:", data);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const doesMangaExist = await Manga.exists({ _id: data.mangaId });
    if (!doesMangaExist) {
      throw new NotFoundException();
    }
    const newCover = await Cover.create([{ ...data }], { session });
    await Manga.findByIdAndUpdate(
      data.mangaId,
      { $push: { covers: newCover[0]._id } },
      { session },
    );
    await session.commitTransaction();
    return newCover[0];
  }
  catch (err) {
    await session.abortTransaction();
    await deleteFiles(data.files);
    if (err.name === NotFoundException.name)
      throw new NotFoundException();

    if (err.code === 11000) {
      throw new UnprocessableEntityException(
        getMessage("cover.error.twinned"),
      );
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while creating cover",
    });
  }
  finally {
    session.endSession();
  }
}

async function findById(id) {
  const document = await Cover.findById(id).exec();
  if (!document) {
    throw new NotFoundException();
  }
  return document;
}
async function findAll(filter, populate = false) {
  let queryOptions = {};

  // Check if filter is empty
  if (Object.keys(filter).length > 0 && filter.constructor === Object) {
    queryOptions.where = { ...filter };
  }
  console.log({ filter, queryOptions });
  const result = await Cover.find(queryOptions).populate(populate ? "mangaId" : null);

  if (result.length === 0) {
    throw new NotFoundException(getMessage("cover.list.empty"));
  }

  return result;
}

// how to update the files?
async function updateCover(filter, data) {
  const document = await Cover.findOneAndUpdate({ ...filter }, data);
  if (!document) {
    throw new NotFoundException();
  }
  return document;
}

async function deleteById(_id, throwNotFound = true) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const document = await Cover.findByIdAndDelete({ _id }).exec();

    if (document === null && throwNotFound) {
      throw new NotFoundException();
    }

    await Manga.findByIdAndUpdate(
      document.mangaId,
      { $pull: { covers: document._id } },
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
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while deleting chapter",
    });
  }
  finally {
    session.endSession();
  }
}

export default {
  createCover,
  findById,
  findAll,
  updateCover,
  deleteById,
};
