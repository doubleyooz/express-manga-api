import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import CryptoJs from 'crypto-js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const folderName =
    process.env.NODE_ENV === 'dev' ? 'uploads/' : 'uploads2/';

const authorFiles = {
    storage: multer.diskStorage({
        destination: (req, files, cb) => {
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
            if (!fs.existsSync(dir + req.body.name))
                fs.mkdirSync(dir + req.body.name);
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                var filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, filename);
            });
        },
    }),
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
            cb(new Error(message));
        }
    },
};

const chapters = {
    storage: multer.diskStorage({
        destination: (req, files, cb) => {
            let scan_id = CryptoJs.AES.decrypt(
                req.auth,
                `${process.env.SHUFFLE_SECRET}`,
            ).toString(CryptoJs.enc.Utf8);

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
                    scan_id,
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
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                var filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, filename);
            });
        },
    }),
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
            cb(new Error(message));
        }
    },
};

const covers = {
    storage: multer.diskStorage({
        destination: (req, files, cb) => {
            let scan_id = CryptoJs.AES.decrypt(
                req.auth,
                `${process.env.SHUFFLE_SECRET}`,
            ).toString(CryptoJs.enc.Utf8);

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

            let dir =
                './' +
                folderName +
                'mangas/' +
                req.body.manga_title +
                '/covers/';

            if (!fs.existsSync(dir)) return false;
            //fs.mkdirSync(dir);
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                var filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, filename);
            });
        },
    }),
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
            cb(new Error(message));
        }
    },
};

export default {
    covers,
    chapters,
    authorFiles,
};
