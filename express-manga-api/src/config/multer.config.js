import path from "path";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";

import { decrypt } from "../utils/password.util.js";

export const folderName = "uploads/";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const limits = () => {
  fileSize: 3 * 1024 * 1024;
};

const dir = path.join(__dirname, "..", "..", folderName);

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const message = `${file.originalname} is invalid. ${getMessage(
      "image.format.not.supported"
    )}`;
    cb(new Error(message));
  }
};

const fileName = (req, file, cb) => {
  const hash = crypto.randomUUID().replace(/-/g, "");
  const timestamp = Date.now().toString(16);
  // Find the last dot to separate the extension
  const lastDotIndex = file.originalname.lastIndexOf(".");
  const baseName = file.originalname.substring(0, lastDotIndex);
  const ext = file.originalname.substring(lastDotIndex + 1);

  // Remove all special characters from the baseName
  const cleanedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "");

  // Limit the cleaned base name to the first 8 characters
  const limitedCleanedBaseName = cleanedBaseName.substring(0, 8);

  const fileName = `${hash}-${timestamp}-${limitedCleanedBaseName}.${ext}`;
  cb(null, fileName);
};

const mangaFolder = path.resolve(__dirname, "..", "..", folderName);

const pagesDestination = (req, files, cb) => {
  const pagesFolder = path.join(mangaFolder, "pages");

  if (!fs.existsSync(pagesFolder)) {
    fs.mkdirSync(path.dirname(dir), { recursive: true });
  }

  cb(null, dir);
};

const coversDestination = (req, files, cb) => {
  const coversFolder = path.join(mangaFolder, "covers");

  cb(null, coversFolder);

  if (!fs.existsSync(coversFolder)) {
    fs.mkdirSync(coversFolder, { recursive: true });
  }
};

const multerConfig = (destination) => {
  return {
    storage: multer.diskStorage({
      destination: destination,
      filename: fileName,
    }),
    limits: limits,
    fileFilter: fileFilter,
  };
};

export default {
  covers: multerConfig(coversDestination),
  chapters: multerConfig(pagesDestination),
};
