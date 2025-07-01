import mongoose from "mongoose";

import {
  createAuthor,
  deleteAuthor,
  findAuthor,
  listAuthor,
  updateAuthor,
} from "../../../helpers/author.helper.js";
import { artist, bad_artist, writer } from "../../../mocks/author.mock.js";
import {
  corruptedToken,
  scanToken,
  userToken,
} from "../../../mocks/jwt.mock.js";

const describeif = condition => (condition ? describe : describe.skip);
const runAll = true;
describe("author", () => {
  let mockToken = scanToken(mongoose.Types.ObjectId().toString());

  describeif(runAll)("should accept", () => {
    createAuthor(artist, mockToken, 200);
    createAuthor(writer, mockToken, 200);

    listAuthor({}, [artist, writer], mockToken, 200);
    findAuthor(writer, mockToken, 200);

    updateAuthor(
      { _id: 1, name: "George Masara" },
      mockToken,
      "update name",
    );
    updateAuthor({ _id: 1, types: ["artist"] }, mockToken, "update type");

    deleteAuthor({ author_id: 1 }, mockToken);
  });

  describeif(runAll)("should reject", () => {

  });
});
