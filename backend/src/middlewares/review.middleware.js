import yup from 'yup';

import { review_rules as rules } from '../utils/yup.util.js';

async function store(req, res, next) {
    let schema = yup.object().shape({
        text: rules.text.required(),
        manga_id: rules._id.required(),
        rating: rules.rating.required(),
    });

    schema
        .validate(req.body)
        .then(() => {
            next();
        })
        .catch(function (e) {
            console.log(e);
            return res.jsonBadRequest(null, null, e);
        });
}

async function findById(req, res, next) {
    let schema = yup.object().shape({
        _id: rules._id.required(),
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
    let schema = yup
        .object()
        .shape({
            manga_id: rules.id_not_required,
            user_id: rules.id_not_required,
        })
        .test(
            'at-least-one-field',
            'you must provide at least one id',
            value => !!(value.manga_id || value.user_id),
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

async function update(req, res, next) {
    let schema = yup.object().shape({
        text: rules.text,
        _id: rules._id.required(),
        rating: rules.rating,
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

export default {
    store,
    findById,
    list,
    update,
};
