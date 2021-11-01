import { authorTests } from "./Author.js";
import { mangaTests } from "./Manga.js";
import { sessionTests } from "./Session.js";

import setupDB from "./test-setup.js";

setupDB("test");

describe("Session", sessionTests);
describe("Author", authorTests);
describe("Manga", mangaTests);
