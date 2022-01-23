import yup from 'yup';
import CryptoJs from 'crypto-js';

import jwt from '../utils/jwt.util.js';
import { rules } from '../utils/yup.utils.js';

async function valid_google_sign_up(req, res, next) {
    const { token, password } = req.body;

    let payload = null;
    console.log(token);
    try {
        payload = jwt.verifyJwt(token, 3);
    } catch (err) {
        console.log(err);
        return res.jsonUnauthorized(null, null, null);
    }

    const yupObject = yup.object().shape({
        email: rules.email,
        password: rules.password,
        name: rules.username,
        role: rules.role,
    });
    console.log(req.body);
    yupObject
        .validate({
            email: payload.email,
            name: payload.name,
            password: password,
        })
        .then(() => {
            req.body = {
                email: payload.email,
                name: payload.name,
                password: password,
            };
            next();
        })
        .catch(err => {
            console.log(err);
            return res.jsonBadRequest(null, null, err.errors);
        });
}

async function valid_sign_up(req, res, next) {
    const yupObject = yup.object().shape({
        email: rules.email,
        password: rules.password,
        name: rules.username,
        role: rules.role,
    });

    yupObject
        .validate(req.body)
        .then(() => next())
        .catch(err => {
            return res.jsonBadRequest(null, null, err.errors);
        });
}

async function valid_sign_in(req, res, next) {
    const [hashType, hash] = req.headers.authorization
        ? req.headers.authorization.split(' ')
        : [''];

    if (hashType !== 'Basic') {
        return res.jsonUnauthorized(null, null, null);
    }

    const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

    const yupObject = yup.object().shape({
        email: rules.email,
        password: rules.sign_in_password,
    });

    yupObject
        .validate({ email: email, password: password })
        .then(() => next())
        .catch(err => {
            return res.jsonBadRequest(null, null, err.errors);
        });
}

async function valid_findOne(req, res, next) {
    let schema = yup.object().shape({
        user_id: yup
            .string('user_id must be a string.')
            .strict()
            .required()
            .test('isValidMongoId', getMessage('invalid.object.id'), value =>
                isValidMongoIdRequired(value),
            ),
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
        email: yup.string().email(),
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

async function valid_update(req, res, next) {
    let schema = yup.object().shape({
        name: rules.username,
    });

    schema
        .validate(req.body)
        .then(() => {
            next();
        })
        .catch(err => {
            return res.jsonBadRequest(null, null, err.toString());
        });
}

async function valid_remove(req, res, next) {
    let schema = yup.object().shape({
        user_id: yup
            .string()
            .strict()
            .required()
            .test('isValidMongoId', getMessage('invalid.object.id'), value =>
                isValidMongoIdRequired(value),
            ),
    });

    try {
        schema
            .validate(req.query)
            .then(() => {
                let req_id = CryptoJs.AES.decrypt(
                    req.auth,
                    `${process.env.SHUFFLE_SECRET}`,
                ).toString(CryptoJs.enc.Utf8);

                if (req_id === user_id) {
                    next();
                }

                return res.jsonBadRequest(null, null, err.errors);
            })
            .catch(err => {
                return res.jsonBadRequest(null, null, err.errors);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

export default {
    valid_google_sign_up,
    valid_sign_up,
    valid_sign_in,
    valid_findOne,
    valid_list,
    valid_update,
    valid_remove,
};