import yup from 'yup';

import { rules } from '../utils/yup.util.js';

async function store(req, res, next) {
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

async function findById(req, res, next) {
    let schema = yup.object().shape({
        _id: rules.mongo_id_req,
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

async function list(req, res, next) {
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

async function update(req, res, next) {
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);
    var obj = {};
    Object.keys(req.body).forEach(function (value) {
        if (value !== '_id') obj[value] = rules[value];
    });
    obj._id = rules.mongo_id_req;

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

export default {
    store,
    findById,
    list,
    update,
};
