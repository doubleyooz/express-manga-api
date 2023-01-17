import nodemailer from 'nodemailer';
//import smtpTransport from 'nodemailer-smtp-transport';

import User from '../models/user.model.js';
import { client } from '../config/grpc.config.js';
import { TEST_E2E_ENV } from '../utils/constant.util.js';
import jwt from '../utils/jwt.util.js';
import { encrypt, decrypt, hashPassword } from '../utils/password.util.js';
import { getMessage } from '../utils/message.util.js';

async function store(req, res) {
    const { email, password, name, role } = req.body;

    User.find({ email: email })
        .select({ _id: 1, email: 1, active: 1 })
        .then(user => {
            if (user[0].active) {
                return res.jsonBadRequest(
                    null,
                    getMessage('user.error.sign_up.duplicatekey'),
                    null,
                );
            }
            const tkn = jwt.generateJwt(
                {
                    id: encrypt(user[0]._id.toString()),
                },
                3,
            );
            client.sendMail();
            client.getAll(null, (err, data) => {
                if (!err) {
                    res.render('customers', {
                        results: data.customers,
                    });
                }
            });
            sendEmail(email);

            return res.jsonOK(
                null,
                getMessage('user.activation.account.activate'),
                process.env.NODE_ENV === TEST_E2E_ENV ? tkn : null,
            );
        })
        .catch(err => {
            const p1 = new User({
                email: email,
                password: async () => await hashPassword(password),
                name: name,
                role: role ? role : 'User',
            });

            p1.save()
                .then(result => {
                    result.password = undefined;

                    const activationToken = jwt.generateJwt(
                        { id: encrypt(p1._id.toString()) },
                        3,
                    );

                    // async..await is not allowed in global scope, must use a wrapper
                    // Generate test SMTP service account from ethereal.email

                    sendEmail(email);
                    return res.jsonOK(
                        null,
                        getMessage('user.activation.account.activate'),
                        process.env.NODE_ENV === TEST_E2E_ENV
                            ? activationToken
                            : null,
                    );
                })
                .catch(err => {
                    console.log(err);
                    if (err.name === 'MongoError' && err.code === 11000) {
                        //next(new Error("There was a duplicate key error"));
                        return res.jsonBadRequest(
                            null,
                            getMessage('user.error.sign_up.duplicatekey'),
                            { err },
                        );
                    } else {
                        return res.jsonBadRequest(null, null, { err });
                    }
                });
        });
}

async function findOne(req, res) {
    const { user_id } = req.query;

    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    User.findById(user_id)
        .then(doc => {
            return res.jsonOK(
                doc,
                getMessage('user.findone.success'),
                new_token,
            );
        })
        .catch(err => {
            return res.jsonServerError(null, null, null);
        });
}

async function list(req, res) {
    const { name } = req.query;

    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    let role = req.role ? decrypt(req.role) : 0;

    req.role = null;

    let search =
        role === 1
            ? name
                ? { name: { $regex: '^' + name, $options: 'i' } }
                : {}
            : name
            ? { name: { $regex: '^' + name, $options: 'i' }, active: true }
            : { active: true };

    let docs = [];

    (await User.find(search)).forEach(function (doc) {
        docs.push(doc);
    });

    res.jsonOK(docs, getMessage('user.list.success') + docs.length, new_token);
}

async function update(req, res) {
    const { name } = req.body;
    const new_token = req.new_token ? req.new_token : null;
    req.new_token = null;

    User.findOne({
        _id: decrypt(req.auth),
        active: true,
    }).then(user => {
        user.name = name;
        user.save()
            .then(result => {
                return res.jsonOK(
                    null,
                    getMessage('user.update.name.success'),
                    new_token,
                );
            })
            .catch(err => {
                return res.jsonServerError(null, null, new_token);
            });
    });
}

async function remove(req, res) {
    const { user_id } = req.query;
    console.log(user_id);

    User.findOne({ _id: user_id })
        .then(result => {
            User.deleteOne({ _id: user_id }, function (err) {
                if (err) {
                    return res.jsonNotFound(
                        null,
                        getMessage('user.delete.fail'),
                        err.message,
                    );
                } else {
                    return res.jsonOK(
                        null,
                        getMessage('user.delete.success'),
                        result,
                    );
                }

                // deleted at most one tank document
            });
        })
        .catch(err => {
            return res.jsonNotFound(
                null,
                getMessage('user.error.notfound'),
                err.message,
            );
        });
}

export default { store, findOne, list, update, remove };
