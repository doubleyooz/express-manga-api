import yup from 'yup';

import { chapter_rules as rules } from '../utils/yup.util.js';

async function valid_store(req, res, next) {
    let schema = yup.object().shape({
        manga_title: rules.manga_title.required(),
        chapter_title: rules.chapter_title.required(),
        number: rules.number.required(),
        language: rules.language.required(),
    });
    try {
        await schema
            .validate(req.body, { stripUnknown: true })
            .then((result) => {
                if (req.files.length) {
                    req.body = result;
                    next();
                }
                else return res.jsonBadRequest(null, null, null);
            })
            .catch(function (e) {
                return res.jsonBadRequest(null, null, e);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err);
    }
}

async function valid_findOne(req, res, next) {
    let schema = yup.object().shape({
        chapter_id: rules._id.required(),
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

async function valid_list(req, res, next) {
    let schema = yup.object().shape({
        manga_id: rules._id.required(),
    });
    schema
        .validate(req.query)
        .then(() => {
            next();
        })
        .catch(err => {
            return res.jsonBadRequest(null, null, err.errors);
        });
}

async function valid_update(req, res, next) {
    let schema = yup.object().shape({
        chapter_title: rules.chapter_title,
        number: rules.number,
        _id: rules._id.required(),
        language: rules.language,
    });

    try {
        schema
            .validate(req.body)
            .then((result) => {
                
                req.body = result;
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
        _id: rules._id.required(),
        manga_id: rules._id.required(),
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
