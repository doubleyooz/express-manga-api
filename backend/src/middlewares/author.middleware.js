import yup from 'yup';

import { rules } from '../utils/yup.util.js';

async function valid_store(req, res, next) {
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);

    const schema = yup.object().shape({
        types: rules.types.required(),
        name: rules.name.required(),
        birthDate: rules.birthDate.required(),
        deathDate: rules.deathDate,
        socialMedia: rules.socialMedia.required(),
        biography: rules.biography.required(),
    });

    schema
        .validate(req.body, { stripUnknown: true })
        .then(result => {
            req.body = result;

            next();
        })
        .catch(function (e) {
            console.log(e);
            return res.jsonBadRequest(null, null, e);
        });
}

async function valid_findOne(req, res, next) {
    let schema = yup.object().shape({
        author_id: rules.mongo_id_req,
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
        types: rules.name,
        name: rules.name,
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

async function valid_update(req, res, next) {
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);
    var obj = {};
    Object.keys(req.body).forEach(function (value) {
        if (value !== '_id') obj[value] = rules[value];
    });
    obj._id = rules.mongo_id_req;
    console.log(obj);
    const schema = yup
        .object()
        .shape(obj)
        .test(
            'at-least-one-field',
            'you must provide at least one field',
            value =>
                !!(
                    value.types ||
                    value.name ||
                    value.birthDate ||
                    value.deathDate ||
                    value.socialMedia ||
                    value.biography
                ),
        );
    console.log(req.body);
    try {
        schema
            .validate(req.body, { stripUnknown: true })
            .then(result => {
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
        author_id: rules.mongo_id_req.required(),
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
