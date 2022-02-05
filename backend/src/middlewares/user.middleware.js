import yup from 'yup';

import jwt from '../utils/jwt.util.js';
import { decrypt } from '../utils/password.util.js';
import { user_rules as rules } from '../utils/yup.util.js';

async function google_sign_up(req, res, next) {
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
        name: rules.name,
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

async function sign_up(req, res, next) {
    const yupObject = yup.object().shape({
        email: rules.email,
        password: rules.password,
        name: rules.name,
        role: rules.role,
    });

    yupObject
        .validate(req.body)
        .then(() => next())
        .catch(err => {
            return res.jsonBadRequest(null, null, err.errors);
        });
}

async function sign_in(req, res, next) {
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

async function findOne(req, res, next) {
    let schema = yup.object().shape({
        user_id: rules._id,
    });

    try {
        schema
            .validate(req.query)
            .then(() => {
                next();
            })
            .catch(err => {
                console.log(err);
                return res.jsonBadRequest(null, null, err.errors);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

async function list(req, res, next) {
    let schema = yup.object().shape({
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
    let schema = yup.object().shape({
        name: rules.name,
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

async function remove(req, res, next) {
    let schema = yup.object().shape({
        user_id: rules._id,
    });

    try {
        schema
            .validate(req.query)
            .then(() => {
                if (decrypt(req.auth) === user_id) {
                    next();
                } else {
                    return res.jsonBadRequest(null, null, null);
                }
            })
            .catch(err => {
                return res.jsonBadRequest(null, null, err.errors);
            });
    } catch (err) {
        return res.jsonBadRequest(null, null, err.errors);
    }
}

export default {
    google_sign_up,
    sign_up,
    sign_in,
    findOne,
    list,
    update,
    remove,
};
