import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { getMessage } from "../utils/message.util.js";

export const folderName = "uploads/";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function limits() {
  return { fileSize: 3 * 1024 * 1024 };
}

const dir = path.join(__dirname, "..", "..", folderName);

function fileFilter(req, file, cb) {
  const allowedMimes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  }
  else {
    const message = `${file.originalname} is invalid. ${getMessage(
      "image.format.not.supported",
    )}`;
    cb(new Error(message));
  }
}

function fileName(req, file, cb) {
  const hash = crypto.randomUUID().replace(/-/g, "");
  const timestamp = Date.now().toString(16);
  // Find the last dot to separate the extension
  const lastDotIndex = file.originalname.lastIndexOf(".");
  const baseName = file.originalname.substring(0, lastDotIndex);
  const ext = file.originalname.substring(lastDotIndex + 1);

  // Remove all special characters from the baseName
  const cleanedBaseName = baseName.replace(/[^a-z0-9]/gi, "");

  // Limit the cleaned base name to the first 8 characters
  const limitedCleanedBaseName = cleanedBaseName.substring(0, 8);

  const fileName = `${hash}-${timestamp}-${limitedCleanedBaseName}.${ext}`;
  cb(null, fileName);
}

const mangaFolder = path.resolve(__dirname, "..", "..", folderName);

function pagesDestination(req, files, cb) {
  const pagesFolder = path.join(mangaFolder, "pages");

  if (!fs.existsSync(pagesFolder)) {
    fs.mkdirSync(path.dirname(dir), { recursive: true });
  }

  cb(null, dir);
}

function coversDestination(req, files, cb) {
  const coversFolder = path.join(mangaFolder, "covers");

  cb(null, coversFolder);

  if (!fs.existsSync(coversFolder)) {
    fs.mkdirSync(coversFolder, { recursive: true });
  }
}

function multerConfig(destination) {
  return {
    storage: multer.diskStorage({
      destination,
      filename: fileName,
    }),
    limits,
    fileFilter,
  };
}

export default {
  covers: multerConfig(coversDestination),
  chapters: multerConfig(pagesDestination),
};
