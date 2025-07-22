import * as _repository from "../database/abstract.repository.js";
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
    const newAuthor = await _repository.create(Author, data);

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
  const session = await _repository.getSession();

  try {
    _repository.startTransaction(session);

    // 1. Find all chapters with their images
    const document = await _repository.findByIdAndDelete(Author, authorId, null, session);

    if (!document && throwNotFound) {
      throw new NotFoundException();
    }

    document.mangas.forEach(async (mangaId) => {
      await _repository.findByIdAndUpdate(
        Manga,
        mangaId,
        { $pull: { writers: document._id, artists: document._id } },
        session,
      );
    });
    // 4. Collect all image files to delete
    const allImages = document.imgCollection;

    console.log("Total images to delete:", allImages.length);

    // 5. Commit transaction first
    await _repository.commitTransaction(session);

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
    await _repository.abortTransaction(session);
    if (error instanceof CustomException) {
      throw new NotFoundException();
    }
    throw error;
  }
  finally {
    _repository.endSession(session);
  }
}

export default {
  create,
  findById: id => _repository.findById(Author, id),
  findAll: (filter, populate = null) => _repository.findAll(Author, filter, populate),
  update: (filter, data) => _repository.update(Author, filter, data),
  deleteById,
};
