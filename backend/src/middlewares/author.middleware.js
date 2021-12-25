import yup from 'yup';
import { differenceInCalendarDays } from 'date-fns';

import { rules } from '../utils/yup.utils.js';

async function valid_store(req, res, next) {
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);

    const schema = yup.object().shape({
        type: rules.type_author.required(),
        name: rules.authorname.required(),
        birthDate: rules.birthDate.max(currentDate).required(),
        deathDate: rules.deathDate,
        socialMedia: rules.socialMedia.required(),
        biography: rules.biography.required(),
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
        type: rules.type,
        name: rules.authorname,
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

    const schema = yup
        .object()
        .shape({
            author_id: rules.mongo_id_req,
            type: rules.type,
            name: rules.authorname,
            birthDate: rules.birthDate.max(currentDate),
            deathDate: rules.deathDate,
            socialMedia: rules.socialMedia,
            biography: rules.biography,
        })
        .test(
            'at-least-one-field',
            'you must provide at least one field',
            value =>
                !!(
                    value.type ||
                    value.name ||
                    value.birthDate ||
                    value.deathDate ||
                    value.socialMedia ||
                    value.biography
                ),
        );

    try {
        schema
            .validate(req.body)
            .then(() => {
                schema.cast(req.body, { stripUnknown: true });
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
