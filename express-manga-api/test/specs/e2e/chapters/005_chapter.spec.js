import mongoose from "mongoose";

import {
  createChapter,
  deleteChapter,
  findChapter,
  listChapter,
} from "../../../helpers/chapter.helper.js";
import { createManga } from "../../../helpers/manga.helper.js";
import { chapter, chapter2 } from "../../../mocks/chapter.mock.js";

import { scanToken, userToken } from "../../../mocks/jwt.mock.js";
import { manga, manga2 } from "../../../mocks/manga.mock.js";

const describeif = condition => (condition ? describe : describe.skip);
const runAll = true;

describe("chapter", () => {
  describeif(runAll)("should accept", () => {
    let mockToken = scanToken(mongoose.Types.ObjectId().toString());

    createManga(manga, mockToken);
    chapter.manga_id = manga.title;
    chapter2.manga_id = manga.title;
    createChapter(chapter, mockToken);
    createChapter(chapter2, mockToken);
    findChapter(chapter);
    listChapter([chapter, chapter2], chapter.manga_id, 2);
    deleteChapter(chapter, mockToken);
    deleteChapter(chapter2, mockToken);
  });
});
