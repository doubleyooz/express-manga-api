import { abortTransaction, commitTransaction, endSession, findAll, findById, getSession, startTransaction, update } from "../database/abstract.repository.js";
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

async function create(data) {
  try {
    const newAuthor = await Author.create({
      ...data,
    });

    return newAuthor[0];
  }
  catch (err) {
    await deleteFiles(data.files);

    if (err.code === 11000) {
      throw new UnprocessableEntityException(getMessage("author.error.twinned"));
    }
    throw new InternalServerErrorException({
      code: err.code,
      message: "Error while creating author",
    });
  }
}

async function deleteById(authorId, throwNotFound = true) {
  const session = await getSession();

  try {
    startTransaction(session);

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
    await commitTransaction(session);

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
    await abortTransaction(session);
    if (error instanceof CustomException) {
      throw new NotFoundException();
    }
    throw error;
  }
  finally {
    endSession(session);
  }
}

export default {
  create,
  findById: id => findById(Author, id),
  findAll: (filter, populate = null) => findAll(Author, filter, populate),
  update: (filter, data) => update(Author, filter, data),
  deleteById,
};
