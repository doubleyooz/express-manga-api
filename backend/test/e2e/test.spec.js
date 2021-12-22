import { authorTests } from "./tests/Author.js";
import { mangaTests } from "./tests/Manga.js";
import { sessionTests } from "./tests/Session.js";

import setupDB from "./test-setup.js";

setupDB("test");

describe("Session", sessionTests);
describe("Author", authorTests);
describe("Manga", mangaTests);
