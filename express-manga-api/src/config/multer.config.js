import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import multer from "multer";
import env from "../env.js";
import { getMessage } from "../utils/message.util.js";

export const FIELDNAME = "files";
const AUTHORS = "authors";
const PAGES = "pages";
const COVERS = "covers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function limits() {
  return { fileSize: 3 * 1024 * 1024 };
}

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

const uploadFolder = path.resolve(__dirname, "..", "..", env.UPLOAD_PATH);

function createDestination(subfolder) {
  const destinationPath = path.join(uploadFolder, subfolder);
  console.log({ destinationPath });
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }

  return `${env.UPLOAD_PATH}${subfolder}/`;
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

// Generic upload handler
function createUploadHandler(fieldName) {
  const destination = createDestination(fieldName);
  return (req, res, next) => {
    console.log({ destination, fieldName });
    const upload = multer(multerConfig(destination)).array(FIELDNAME);

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: "File too large",
            message: "File size exceeds 3MB limit",
          });
        }
      }

      if (err) {
        console.log({ err });
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: HttpStatusMessages.BAD_REQUEST,
          message: err.message,
        });
      }

      next();
    });
  };
}

// Create specific handlers using the generic function
const uploadCovers = createUploadHandler(COVERS);
const uploadChapters = createUploadHandler(PAGES);
const uploadAuthors = createUploadHandler(AUTHORS);

export {
  uploadAuthors,
  uploadChapters,
  uploadCovers,
};
