import fs from 'fs';
import yup from 'yup';

import { author_rules as rules } from '../utils/yup.util.js';

import Author from '../models/author.model.js';
import Manga from '../models/manga.model.js';

import { getMessage } from '../utils/message.util.js';
import { folderName } from '../config/multer.config.js';

async function store(req, res) {
    const { types, name, birthDate, socialMedia, deathDate, biography } =
        req.body;
    const new_token = req.new_token ? req.new_token : null;
    req.auth = null;
    req.new_token = null;
    
    const imgCollection = req.files.map(x => ({
        mimetype: x.mimetype,
        filename: x.filename,
        size: x.size,
    }));

    const deleteFiles = () => {
        Object.keys(req.files).forEach(i => {
            let file = req.files[i];
            fs.unlinkSync(folderName + 'authors/' + name + '/' + file.filename);
        });
    };

    const author = new Author({
        imgCollection: imgCollection,
        types: types,
        name: name,
        birthDate: birthDate,
        deathDate: deathDate ? deathDate : null,
        socialMedia: socialMedia,
        biography: biography,
    });

    author
        .save()
        .then(result => {
            return res.jsonOK(
                result,
                getMessage('author.save.success'),
                new_token,
            );
        })
        .catch(err => {
            deleteFiles();
            return res.jsonServerError(null, null, err);
        });
}

async function findOne(req, res) {
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    const author = await Author.findById(req.query._id).exec();

    if (author === null) {
        return res.jsonNotFound(
            author,
            getMessage('author.notfound', new_token),
        );
    }
    return res.jsonOK(author, getMessage('author.findone.success'), new_token);
}

async function list(req, res) {
    const { types, name } = req.query;
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    let docs = [];

    const search = types
        ? name
            ? {
                  name: { $regex: name, $options: 'i' },
                  types: types,
              }
            : { types: types }
        : name
        ? { name: { $regex: name, $options: 'i' } }
        : {};

    (await Author.find(search).sort('updatedAt')).forEach(function (doc) {
        docs.push(doc);
    });

    if (docs.length === 0) {
        return res.jsonNotFound(
            docs,
            getMessage('author.list.empty'),
            new_token,
        );
    } else {
        return res.jsonOK(
            docs,
            getMessage('author.list.success') + ': ' + docs.length,
            new_token,
        );
    }
}

async function update(req, res) {
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;
    if (
        await Author.exists({
            name: req.body.name,
            _id: { $ne: req.body._id },
        })
    )
        return res.jsonBadRequest(
            null,
            getMessage('author.error.overwrite'),
            new_token,
        );

    Author.findById(req.body._id)
        .select({ birthDate: 1, deathDate: 1, name: 1 })
        .then(doc => {
            if (!doc) {
                return res.jsonNotFound(
                    null,
                    getMessage('author.notfound'),
                    new_token,
                );
            }

            const schema = yup.object().shape({
                birthDate: rules.birthDate.required(),
                deathDate: rules.deathDate.required(),
            });

            let temp =
                req.body.birthDate && doc.deathDate
                    ? {
                          birthDate: req.body.birthDate,
                          deathDate: doc.deathDate,
                      }
                    : req.body.deathDate && !req.body.birthDate
                    ? {
                          birthDate: doc.birthDate,
                          deathDate: req.body.deathDate,
                      }
                    : {};

            if (!schema.isValidSync(temp))
                return res.jsonBadRequest(null, null, null);

            if (req.body.name) {
                const currPath = './' + folderName + `authors/${doc.name}`;
                const newPath = './' + folderName + `authors/${req.body.name}`;

                fs.rename(currPath, newPath, function (err) {
                    if (err) {
                        if (fs.existsSync(newPath)) {
                            fs.rmSync(newPath, { recursive: true });
                        }

                        fs.rename(currPath, newPath, function (e) {
                            if (e) {
                                fs.rmSync(newPath, { recursive: true });
                                console.log(e);
                            } else {
                                console.log(
                                    'Successfully renamed the directory.',
                                );
                            }
                        });
                    } else {
                        console.log('Successfully renamed the directory.');
                    }
                });
            }

            doc.updateOne(req.body)
                .then(result => {
                    return res.jsonOK(
                        null,
                        getMessage('author.update.success'),
                        new_token,
                    );
                })
                .catch(err => {
                    console.log(err);
                    return res.jsonServerError(null, null, err);
                });
        })
        .catch(err => {
            console.log(err);
            return res.jsonServerError(null, null, err);
        });
}

async function remove(req, res) {
    const { _id } = req.query;
    const author = await Author.findById(_id);

    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    if (author) {
        Author.deleteOne({ _id: _id })
            .then(answer => {
                let mangas = [];
                let dir = folderName + 'authors/' + author.name + '/';

                author.imgCollection.forEach(file => {
                    fs.unlinkSync(dir + file.filename);
                });

                fs.rm(dir, { recursive: true }, err => {
                    if (err) {
                        console.log(err);
                    }
                });

                fs.rmSync(dir, { recursive: true });

                author.works.forEach(manga_id => {
                    Manga.findById(manga_id)
                        .then(manga => {
                            manga[author.type] = manga[author.type].filter(
                                function (crt_id) {
                                    return crt_id.toString() !== _id.toString();
                                },
                            );
                            manga
                                .save()
                                .then(answer => {
                                    mangas.push({ 'author-deleted': manga_id });
                                })
                                .catch(err => {
                                    mangas.push({
                                        'author-not-deleted': manga_id,
                                    });
                                });
                        })
                        .catch(err => {
                            mangas.push({ 'manga-not-found': manga_id });
                        });
                });
                return res.jsonOK(
                    { removed: true, mangas: mangas },
                    getMessage('author.delete.success'),
                    new_token,
                );
            })
            .catch(err => {
                console.log(err);
                return res.jsonBadRequest(
                    null,
                    getMessage('author.notfound'),
                    new_token,
                );
            });
    } else {
        return res.jsonNotFound(null, null, new_token);
    }
}

export default { store, findOne, list, update, remove };
