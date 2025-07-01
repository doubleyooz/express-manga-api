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
  let mockToken2 = corruptedToken("");

  describeif(runAll)("should reject", () => {
    // prettier-ignore
    describeif(runAll)("invalid token", () => {
      createAuthor(artist, mockToken2, 401);
      createAuthor(writer, mockToken2, 401);

      findAuthor({ _id: "kKucLRLt9Npgxcep6iWH" }, mockToken2, 400);
      findAuthor({ _id: "kKucLRLt9Npgxcep6iWH" }, mockToken2, 400);
      findAuthor({ _id: mongoose.Types.ObjectId().toString() }, mockToken2, 404);
      findAuthor({ _id: mongoose.Types.ObjectId().toString() }, mockToken2, 404);
    });
  });
});
