import { sessionTests } from "./Session.js";
import { mangaTests } from "./Manga.js";

import setupDB from "./test-setup.js";

setupDB("test");

describe("Session", sessionTests);
describe("Manga", mangaTests);
