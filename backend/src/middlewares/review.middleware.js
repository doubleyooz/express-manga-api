import yup from 'yup';

import { rules } from '../utils/yup.util.js';

async function valid_store(req, res, next) {
    let schema = yup.object().shape({
        text: rules.text.required(),
        manga_id: rules.mongo_id_req.required(),
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

async function valid_findOne(req, res, next) {
    let schema = yup.object().shape({
        review_id: rules.mongo_id_req.required(),
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
    let schema = yup
        .object()
        .shape({
            manga_id: rules.mongo_id,
            user_id: rules.mongo_id,
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

async function valid_update(req, res, next) {
    let schema = yup.object().shape({
        text: rules.text,
        review_id: rules.mongo_id_req.required(),
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

async function valid_remove(req, res, next) {
    let schema = yup.object().shape({
        review_id: rules.mongo_id_req.required(),
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
