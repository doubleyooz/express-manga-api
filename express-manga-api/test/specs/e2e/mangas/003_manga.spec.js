import {
  createManga,
  deleteManga,
  findManga,
  listManga,
  updateManga,
} from "../../../helpers/manga.helper.js";
import { scanToken, userToken } from "../../../mocks/jwt.mock.js";

import { manga, manga2 } from "../../../mocks/manga.mock.js";

const describeif = condition => (condition ? describe : describe.skip);
const runAll = true;

describe("manga", () => {
  describeif(runAll)("should accept", () => {
    let mockToken = scanToken(manga.scan_id);

    createManga(manga, mockToken);
    createManga(manga2, mockToken);

    updateManga({ title: "Gantz", _id: 1 }, mockToken, "update name");
    findManga(manga, true);
    findManga(manga2, true);
    findManga(manga);
    listManga([manga2, manga], 2);

    deleteManga(manga, mockToken);
  });
});
