import yup from 'yup';

import { manga_rules as rules } from '../utils/yup.util.js';

async function store(req, res, next) {
    let schema = yup.object().shape({
        title: rules.title.required(),
        genres: rules.genres.required(),
        themes: rules.themes.required(),

        writer_id: rules.writer_id.required(),
        artist_id: rules.artist_id.required(),
        synopsis: rules.synopsis.required(),
        n_chapters: rules.n_chapters.required(),
        status: rules.status.required(),
        nsfw: rules.nsfw.required(),
        type: rules.type.required(),
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

async function findOne(req, res, next) {
    let schema = yup.object().shape(
        {
            title: rules.title.when(['_id'], {
                is: _id => !_id,
                then: yup.required(),
            }),
            _id: rules.mongo_id.when(['title'], {
                is: title => !title,
                then: yup.required(),
            }),
        },
        [['title', '_id']],
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

async function list(req, res, next) {
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

async function update(req, res, next) {
    var obj = {};
    Object.keys(req.body).forEach(function (value) {
        obj[value] = rules[value];
    });
    obj.artist_id = rules.id_not_required;
    obj.writer_id = rules.id_not_required;

    let schema = yup.object().shape(obj).test();

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

async function remove(req, res, next) {
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
    store,
    findOne,
    list,
    update,
    remove,
};
