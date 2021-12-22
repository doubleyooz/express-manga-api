import { authorTests } from "./tests/Author.js";
import { mangaTests } from "./tests/Manga.js";
import { sessionTests } from "./tests/Session.js";
import { wrapper } from "./helpers/Wrapper.js";

import setupDB from "./test-setup.js";

const describeif = (condition) => condition ? describe : describe.skip;

setupDB("test");
describe("Session", sessionTests);
describeif(false)("Author", authorTests);
describeif(false)("Manga", mangaTests);
