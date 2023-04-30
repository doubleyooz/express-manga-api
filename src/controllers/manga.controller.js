import fs from 'fs';

import Author from '../models/author.model.js';
import Chapter from '../models/chapter.model.js';
import Manga from '../models/manga.model.js';
import User from '../models/user.model.js';

import { MANGA_PROJECTION } from '../utils/constant.util.js';
import { decrypt } from '../utils/password.util.js';
import { getMessage } from '../utils/message.util.js';

import { folderName } from '../config/multer.config.js';

const store = async (req, res) => {
    const {
        title,
        synopsis,
        writer_id,
        artist_id,
        type,
        genres,
        themes,
        n_chapters,
        status,
        languages,
        nsfw,
    } = req.body;

    const new_token = req.new_token || null;
    req.new_token = null;

    let scan_id = decrypt(req.auth);
    req.auth = null;

    const imgCollection = req.files.map(file => ({
        mimetype: file.mimetype,
        filename: file.filename,
        size: file.size,
    }));

    const deleteFiles = () => {
        req.files.forEach(file => {
            fs.unlinkSync(
                folderName + 'mangas/' + title + '/covers/' + file.filename,
            );
        });
    };
    const manga = new Manga({
        imgCollection: imgCollection,
        title: title,
        synopsis: synopsis,
        n_chapters: n_chapters,
        status: status,
        languages: languages,
        genres: genres,
        themes: themes,
        nsfw: nsfw,
        type: type,
        scan_id: scan_id,
        writer_id: writer_id,
        artist_id: artist_id,
        //comments?
    });

    try {
        const [scan, doesMangaExist, artist, writer] = await Promise.all([
            User.findById(scan_id),
            Manga.exists({ title: title }),
            Author.findById(artist_id),
            Author.findById(writer_id),
        ]);

        if (!scan) {
            deleteFiles();
            return res.jsonNotFound(
                null,
                getMessage('manga.error.scan_id'),
                null,
            );
        }

        if (doesMangaExist) {
            deleteFiles();
            return res.jsonBadRequest(
                null,
                getMessage('manga.error.duplicate'),
                new_token,
            );
        }

        if (!artist || !artist.types.includes('artist')) {
            deleteFiles();
            return res.jsonNotFound(
                null,
                getMessage('manga.error.artist'),
                null,
            );
        }

        if (!writer || !writer.types.includes('writer')) {
            deleteFiles();
            return res.jsonNotFound(
                null,
                getMessage('manga.error.writer'),
                null,
            );
        }

        await Promise.all([
            manga.save(),
            artist.updateOne({ $push: { works: manga._id } }),
            writer.updateOne({ $push: { works: manga._id } }),
            scan.updateOne({ $push: { mangas: manga._id } }),
        ]);
        return res.jsonOK(manga, getMessage('manga.save.success'), new_token);
    } catch (error) {
        const isValidationError = error.name === 'ValidationError';

        if (isValidationError) {
            return res.jsonBadRequest(null, error.message, new_token);
        }

        const isMongoError = error.name === 'MongoError';

        if (isMongoError) {
            return res.jsonBadRequest(
                null,
                getMessage('manga.error.mongo'),
                new_token,
            );
        }
        deleteFiles();
        return res.jsonServerError(null, null, error);
    }
};

const findOne = async (req, res) => {
    const { title, _id } = req.query;
    const new_token = req.new_token ? req.new_token : null;
    const role = req.role ? parseInt(decrypt(req.role)) : 0;
    const projection = (MANGA_PROJECTION = [role]);
    req.new_token = null;
    req.role = null;

    try {
        const manga = _id
            ? await Manga.findById(_id).select(projection).exec()
            : await Manga.findOne({ title }).select(projection).exec();

        if (!manga) {
            return res.jsonNotFound(null, getMessage('manga.notfound'), null);
        }

        return res.jsonOK(
            manga,
            getMessage('manga.findone.success'),
            new_token,
        );
    } catch (err) {
        console.log(err);
        return res.jsonServerError(null, null, err);
    }
};

const list = async (req, res) => {
    const { genre, scan_id, title, type, writer_id, artist_id, recent } =
        req.query;
    const new_token = req.new_token ?? null;
    req.new_token = null;

    const role = req.role ? parseInt(decrypt(req.role)) : 0;
    req.role = null;

    const search = {
        genre,
        writer_id,
        type,
        artist_id,
        title: title ? { $regex: title, $options: 'i' } : undefined,
        scan_id,
    };

    let docs = await Manga.find(search)
        .sort('updatedAt')
        .select(projection)
        .lean()
        .exec();
    if (recent) {
        docs = await Promise.all(
            docs.map(async doc => {
                const chapters = await Chapter.find({ manga_id: doc._id })
                    .sort('updatedAt')
                    .select({ number: 1, _id: 0 })
                    .lean()
                    .exec();
                return {
                    _id: doc._id,
                    imgCollection: doc.imgCollection,
                    title: doc.title,
                    updatedAt: doc.updatedAt,
                    chapters: chapters.map(chap => ({ number: chap.number })),
                };
            }),
        );
    }

    docs = docs.map(doc => _.omit(doc, 'user'));

    if (docs.length === 0) {
        return res.jsonNotFound(
            docs,
            getMessage('manga.list.empty'),
            new_token,
        );
    } else {
        return res.jsonOK(
            docs,
            getMessage('manga.list.success') + docs.length,
            new_token,
        );
    }
};

const update = async (req, res) => {
    const { writer_id, artist_id, _id } = req.body;
    const new_token = req.new_token ?? null;
    req.new_token = null;

    const scan_id = decrypt(req.auth);

    const artist = artist_id ? await Author.findById(artist_id) : null;

    if (!artist || !artist.types.includes('artist'))
        return res.jsonBadRequest(null, getMessage('manga.error.artist'), null);

    const writer = writer_id ? await Author.findById(writer_id) : null;

    if (!writer || !writer.types.includes('writer'))
        return res.jsonBadRequest(null, getMessage('manga.error.writer'), null);

    try {
        const manga = await Manga.findById(_id);

        if (manga.scan_id.toString() !== scan_id.toString()) {
            return res.jsonUnauthorized(null, null, null);
        }

        const result = await manga.updateOne(req.body);

        [artist, writer].forEach(async (author, i) => {
            if (author) {
                const condition =
                    i === 0
                        ? author._id.toString() !== manga.artist_id.toString()
                        : author._id.toString() !== manga.writer_id.toString();

                if (condition) {
                    let cloneData = author.works.filter(work_id => {
                        return _id.toString() !== work_id.toString();
                    });
                    //update artist document
                    author.works = cloneData;
                    await author.save();
                }
            }
        });

        if (title) {
            const currPath = folderName + 'mangas/' + manga.title;
            const newPath = folderName + 'mangas/' + title;

            await fs.promises.rename(currPath, newPath);

            console.log('Successfully renamed the directory.');
        }

        return res.jsonOK(null, getMessage('manga.update.success'), new_token);
    } catch (err) {
        console.log(err);
        return res.jsonServerError(null, null, err);
    }
};

const remove = async (req, res) => {
    const { _id } = req.query;

    const manga = await Manga.findById(_id);

    const new_token = req.new_token ?? null;
    req.new_token = null;

    const scan_id = decrypt(req.auth);
    req.auth = null;

    if (!manga)
        return res.jsonBadRequest(
            null,
            getMessage('manga.notfound'),
            new_token,
        );
    if (manga.scan_id.toString() !== scan_id)
        return res.jsonUnauthorized(null, null, null);

    const mangas = await Manga.deleteMany({ _id: _id });

    // update writer and artist documents
    if (mangas.n === 0)
        return res.jsonNotFound(
            mangas,
            getMessage('manga.notfound'),
            new_token,
        );

    try {
        await Promise.all(
            Chapter.find({ _id: _id }).map(async doc => {
                await Promise.all(
                    doc.imgCollection.map(async page => {
                        await fs.promises.unlink(
                            `uploads/${manga.title}/${page.filename}`,
                        );
                    }),
                );
            }),
        );

        const scan = await User.findById(scan_id);
        scan.mangas.pull(_id);
        await scan.save();

        const writer = await Author.findById(manga.writer_id);
        writer.works.pull(_id);
        await writer.save();

        const artist = await Author.findById(manga.artist_id);
        artist.works.pull(_id);
        await artist.save();

        const dir = folderName + 'mangas/' + manga.title;
        await fs.promises.rm(dir, { recursive: true });

        return res.jsonOK(
            {
                'mangas affected': mangas.deletedCount,
                'chapters affected': chapters.deletedCount,
            },
            getMessage('manga.delete.success'),
            new_token,
        );
    } catch (err) {
        console.log(err);
        return res.jsonServerError(null, null, err);
    }
};

export default { store, findOne, list, update, remove };
