import yup from 'yup';

import { rules } from '../utils/yup.util.js';

async function valid_store(req, res, next) {
    let schema = yup.object().shape({
        title: rules.title.required(),
        genres: rules.genres.required(),
        themes: rules.themes.required(),

        writer_id: rules.mongo_id_req.required(),
        artist_id: rules.mongo_id_req.required(),
        synopsis: rules.synopsis.required(),
        n_chapters: rules.n_chapters.required(),
        status: rules.status.required(),
        nsfw: rules.nsfw.required(),
        type: rules.type_manga.required(),
        languages: rules.languages.required(),
    });

    schema
        .validate(req.body)
        .then(() => {
            if (req.file) {
                req.nsfw = req.nsfw === 'true';
                next();
            } else {
                return res.jsonBadRequest(null, null, null);
            }
        })
        .catch(function (e) {
            console.log(e);
            return res.jsonBadRequest(null, null, e.path + ' : ' + e.message);
        });
}

async function valid_findOne(req, res, next) {
    let schema = yup.object().shape(
        {
            title: rules.title.when(['manga_id'], {
                is: manga_id => !manga_id,
                then: yup.required(),
            }),
            manga_id: rules.mongo_id.when(['title'], {
                is: title => !title,
                then: yup.required(),
            }),
        },
        [['title', 'manga_id']],
    );

    try {
        schema
            .validate(req.query)
            .then(() => {
                next();
            })
            .catch(err => {
                return res.jsonBadRequest(null, null, err.errors);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

async function valid_list(req, res, next) {
    let schema = yup.object().shape({
        title: rules.title,
        genre: rules.genre,
        scan_id: rules.mongo_id,
        recent: yup.boolean(),
    });

    try {
        schema
            .validate(req.query)
            .then(() => {
                next();
            })
            .catch(e => {
                return res.jsonBadRequest(
                    null,
                    null,
                    e.path + ' : ' + e.message,
                );
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

async function valid_update(req, res, next) {
    let schema = yup.object().shape({
        title: rules.title,
        genres: rules.genres,
        themes: rules.themes,
        writer_id: rules.mongo_id,
        artist_id: rules.mongo_id,
        synopsis: rules.synopsis,
        n_chapters: rules.n_chapters,
        status: rules.status,
        nsfw: rules.nsfw,
        type: rules.type_manga,
        languages: rules.languages,
        manga_id: rules.mongo_id_req,
    });

    try {
        schema
            .validate(req.body)
            .then(() => {
                next();
            })
            .catch(err => {
                return res.jsonBadRequest(null, null, err.errors);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

async function valid_remove(req, res, next) {
    let schema = yup.object().shape({
        manga_id: rules.mongo_id_req,
    });

    try {
        schema
            .validate(req.query)
            .then(() => {
                next();
            })
            .catch(err => {
                return res.jsonBadRequest(null, null, err.errors);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

export default {
    valid_store,
    valid_findOne,
    valid_list,
    valid_update,
    valid_remove,
};
