import fs from 'fs';
import CryptoJs from 'crypto-js';

import Chapter from '../models/chapter.model.js';
import Manga from '../models/manga.model.js';

import { getMessage } from '../utils/message.util.js';
import folderName from '../config/multer.config.js';

const dir = folderName + 'mangas/';

const read_projection = {
    0: {
        imgCollection: 1,
        title: 1,
        number: 1,
        views: 1,
    },
    1: {
        updatedAt: 1,
        createdAt: 1,
        title: 1,
        number: 1,
        visualizations: 1,
        __v: 1,
        views: 1,
        imgCollection: 1,
    },
    2: {
        imgCollection: 1,
        title: 1,
        number: 1,
        views: 1,
    },
};

const list_projection = {
    0: {
        title: 1,
        number: 1,
        views: 1,
        updatedAt: 1,
        language: 1,
    },
    1: {
        updatedAt: 1,
        createdAt: 1,
        title: 1,
        number: 1,
        language: 1,
        visualizations: 1,
        __v: 1,
        views: 1,
    },
    2: {
        title: 1,
        number: 1,
        language: 1,
        views: 1,
        updatedAt: 1,
    },
};

async function store(req, res) {
    const { manga_title, number, chapter_title, language } = req.body;

    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    Manga.findOne({ title: manga_title }, function (err, manga) {
        if (manga) {
            const filesPath =
                dir +
                manga_title +
                '/' +
                number +
                '/' +
                language +
                '/' +
                manga.scan_id +
                '/';

            Chapter.exists({
                manga_id: manga._id,
                number: number,
                language: language,
            }).then(exists => {
                if (exists) {
                    Object.keys(req.files).forEach(i => {
                        fs.unlinkSync(filesPath + req.files[i].filename);
                    });
                    return res.jsonBadRequest(
                        null,
                        getMessage('chapter.error.duplicate'),
                        new_token,
                    );
                } else {
                    let jsonString = [];

                    Object.keys(req.files).forEach(i => {
                        let file = req.files[i];

                        let temp = {
                            originalname: file.originalname,
                            size: file.size,
                            filename: file.filename,
                        };

                        jsonString.push(JSON.parse(JSON.stringify(temp)));
                    });

                    const chapter = new Chapter({
                        manga_id: manga._id,
                        number: number,
                        title: chapter_title,
                        langauge: language,
                        imgCollection: [],
                    });

                    chapter.imgCollection = jsonString;

                    chapter
                        .save()
                        .then(result => {
                            manga.chapters.push(result._id);
                            manga
                                .save()
                                .then(answer => {
                                    return res.jsonOK(
                                        result,
                                        getMessage('chapter.upload.success'),
                                        new_token,
                                    );
                                })
                                .catch(err => {
                                    Chapter.deleteOne({ _id: result._id });
                                    Object.keys(req.files).forEach(i => {
                                        fs.unlinkSync(
                                            filesPath + req.files[i].filename,
                                        );
                                    });
                                    console.log(err);

                                    return res.jsonServerError(null, null, err);
                                });
                        })
                        .catch(err => {
                            Object.keys(req.files).forEach(i => {
                                fs.unlinkSync(
                                    filesPath + req.files[i].filename,
                                );
                            });
                            console.log(err);
                            return res.jsonServerError(null, null, err);
                        });
                }
            });
        } else {
            let dir2 = dir + manga_title;

            fs.rmdir(dir2, { recursive: true }, err => {
                if (err) {
                    console.log(err);
                }
            });

            fs.rmdirSync(dir2, { recursive: true });

            return res.jsonNotFound(
                null,
                getMessage('manga.notfound'),
                new_token,
            );
        }
    });
}

async function update(req, res) {
    const { chapter_id } = req.body;
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    let manga = await Manga.findById(chapter.manga_id);
    if (!manga) {
        return res.jsonNotFound(null, getMessage('manga.notfound'), new_token);
    }

    if (
        manga.scan_id.toString() ===
        CryptoJs.AES.decrypt(
            req.auth,
            `${process.env.SHUFFLE_SECRET}`,
        ).toString(CryptoJs.enc.Utf8)
    ) {
        manga = null;

        Chapter.findOneAndUpdate(
            req.body,
            { $set: { _id: chapter_id } },
            function (err, doc) {
                if (err) {
                    return res.jsonNotFound(
                        err,
                        getMessage('chapter.notfound'),
                        new_token,
                    );
                } else {
                    return res.jsonOK(
                        req.body,
                        getMessage('chapter.update.success'),
                        new_token,
                    );
                }
            },
        );
    } else {
        return res.jsonUnauthorized(null, null, null);
    }
}

async function findOne(req, res) {
    const { chapter_id } = req.query;
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    let role;

    if (req.role) {
        role = CryptoJs.AES.decrypt(
            req.role,
            `${process.env.SHUFFLE_SECRET}`,
        ).toString(CryptoJs.enc.Utf8);
        req.role = null;
    } else {
        role = 0;
    }

    Chapter.findById(chapter_id)
        .select(read_projection[role])
        .then(doc => {
            console.log(doc.views);
            doc.views = doc.views + 1;
            doc.save()
                .then(() => {
                    return res.jsonOK(
                        doc,
                        getMessage('chapter.findone.success'),
                        new_token,
                    );
                })
                .catch(err => {
                    console.log(err);
                    return res.jsonOK(
                        doc,
                        getMessage('chapter.findone.success'),
                        new_token,
                    );
                });
        })
        .catch(err => {
            return res.jsonBadRequest(err, null, null);
        });
}

async function list(req, res) {
    const { manga_id } = req.query;
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    let role;

    if (req.role) {
        role = CryptoJs.AES.decrypt(
            req.role,
            `${process.env.SHUFFLE_SECRET}`,
        ).toString(CryptoJs.enc.Utf8);
        req.role = null;
    } else {
        role = 0;
    }

    console.log('Role: ' + role);

    let docs = [];
    const doesMangaExist = await Manga.exists({ _id: manga_id });
    if (doesMangaExist) {
        Chapter.find({ manga_id: manga_id })
            .sort('updatedAt')
            .select(list_projection[role])
            .then(result => {
                result.forEach(doc => {
                    docs.push(doc);
                });
                if (docs.length === 0) {
                    return res.jsonNotFound(
                        docs,
                        getMessage('chapter.list.empty'),
                        new_token,
                    );
                } else {
                    return res.jsonOK(
                        docs,
                        getMessage('chapter.list.success') + docs.length,
                        new_token,
                    );
                }
            })
            .catch(err => {
                return res.jsonBadRequest(err, null, null);
            });
    } else {
        return res.jsonNotFound(null, getMessage('manga.notfound'), null);
    }
}

async function remove(req, res) {
    const { manga_id, chapter_id } = req.query;
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    Chapter.findById(chapter_id)
        .then(chapter => {
            cloneData = [];
            //get the deleted chapter read in order to exclude it from chapters array inside manga object
            Manga.findOne({ _id: manga_id }, function (err, manga) {
                if (manga) {
                    cloneData = manga.chapters.filter(function (chap_id) {
                        return chap_id.toString() !== chapter_id.toString();
                    });
                    const filesPath =
                        dir +
                        manga_title +
                        '/' +
                        number +
                        '/' +
                        language +
                        '/' +
                        manga.scan_id +
                        '/';
                    Chapter.deleteMany({ manga_id: manga_id, _id: chapter_id })
                        .then(chapters => {
                            console.log(chapters);
                            if (chapters.n === 0) {
                                //chapter could not be found
                                return res.jsonNotFound(
                                    { removed: false },
                                    getMessage('chapter.notfound'),
                                    new_token,
                                );
                            } else {
                                manga.chapters = cloneData;
                                manga
                                    .save()
                                    .then(result => {
                                        try {
                                            chapter.imgCollection.forEach(
                                                function (file) {
                                                    fs.unlinkSync(
                                                        filesPath +
                                                            file.filename,
                                                    );
                                                },
                                            );
                                        } catch (err) {
                                            return res.jsonServerError(
                                                { removed: true },
                                                getMessage(
                                                    'chapter.delete.error',
                                                ),
                                                null,
                                            );
                                        }

                                        return res.jsonOK(
                                            {
                                                removed: true,
                                                chapters: chapters,
                                            },
                                            getMessage(
                                                'chapter.delete.success',
                                            ),
                                            new_token,
                                        );
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return res.jsonServerError(
                                            null,
                                            null,
                                            err,
                                        );
                                    });
                            }
                        })
                        .catch(err => {
                            return res.jsonBadRequest(err, null, null);
                        });
                } else {
                    return res.jsonNotFound(
                        { removed: false },
                        getMessage('manga.notfound'),
                        new_token,
                    );
                }
            });
        })
        .catch(err => {
            return res.jsonBadRequest(err, null, null);
        });
}
export default { store, findOne, list, update, remove };
