import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

import { decrypt } from '../utils/password.util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const limits = () => {
    fileSize: 3 * 1024 * 1024;
};

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
        cb(new Error(message));
    }
};

const fileName = (req, file, cb) => {
    randomBytes(16, (err, hash) => {
        if (err) cb(err);
        cb(null, `${hash.toString('hex')}-${file.originalname}`);
    });
};

const authorDestination = (req, files, cb) => {
    cb(
        null,
        path.resolve(
            __dirname,
            '..',
            '..',
            folderName,
            'authors/',
            req.body.name,
        ),
    );

    let dir = './' + folderName + 'authors/';

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!fs.existsSync(dir + req.body.name)) fs.mkdirSync(dir + req.body.name);
};

const chaptersDestination = (req, files, cb) => {
    cb(
        null,
        path.resolve(
            __dirname,
            '..',
            '..',
            folderName,
            'mangas/',
            req.body.manga_title + '/',
            req.body.number + '/',
            req.body.language + '/',
            decrypt(req.auth),
        ),
    );

    let dir =
        './' +
        folderName +
        'mangas/' +
        req.body.manga_title +
        '/' +
        req.body.number +
        '/';
    if (!fs.existsSync(dir)) return false;
    //fs.mkdirSync(dir);

    if (!fs.existsSync(dir + req.body.number))
        fs.mkdirSync(dir + req.body.number, { recursive: true });
};

const coversDestination = (req, files, cb) => {
    cb(
        null,
        path.resolve(
            __dirname,
            '..',
            '..',
            folderName,
            'mangas/',
            req.body.manga_title + '/covers',
        ),
    );

    let dir = './' + folderName + 'mangas/' + req.body.manga_title + '/covers/';

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
};

const multerConfig = destination => {
    return {
        storage: multer.diskStorage({
            destination: destination,
            filename: fileName,
        }),
        limits: limits,
        fileFilter: fileFilter,
    };
};

export const folderName =
    process.env.NODE_ENV === 'dev' ? 'uploads/' : 'uploads2/';

export default {
    authorFiles: multerConfig(authorDestination),
    covers: multerConfig(coversDestination),
    chapters: multerConfig(chaptersDestination),
};
