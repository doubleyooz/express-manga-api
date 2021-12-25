import yup from 'yup';
import mongoose from 'mongoose';

import { getMessage } from '../utils/message.util.js';

const rules = {
    text: yup
        .string('text must be a string.')
        .strict()
        .min(2, getMessage('text.invalid.text.short'))
        .max(500, getMessage('text.invalid.text.long')),
    mongo_id_req: yup
        .string()
        .strict()
        .test('isValidMongoId', getMessage('invalid.object.id'), value =>
            isValidMongoIdRequired(value),
        ),
    mongo_id: yup
        .string()
        .strict()
        .test('isValidMongoId', getMessage('invalid.object.id'), value =>
            isValidMongoId(value),
        ),
    rating: yup
        .number('rating must be a number.')
        .min(0, 'The minimum limit is 0.')
        .max(5, 'The maximum limit is 5.'),
};

function isValidMongoIdRequired(value) {
    return (
        mongoose.Types.ObjectId.isValid(value) &&
        String(new mongoose.Types.ObjectId(value)) === value
    );
}

function isValidMongoId(value) {
    if (!!value) {
        mongoose.Types.ObjectId.isValid(value) &&
            String(new mongoose.Types.ObjectId(value)) === value;
    }
    return true;
}

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
