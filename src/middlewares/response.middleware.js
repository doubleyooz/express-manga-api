import { getMessage } from '../utils/message.util.js';

const TYPE_JSON = 'application/json';
const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_UNAUTHORIZED = 401;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_SERVER_ERROR = 500;

const jsonOK = function (data, message, metadata) {
    const status = STATUS_CODE_OK;
    data = data ? data : null;
    message = message ? message : getMessage('default.successfulRequest');
    metadata = metadata ? metadata : {};

    this.status(status);
    this.type(TYPE_JSON);

    return this.json({ message, data, metadata, status: status });
};

const jsonBadRequest = function (data, message, metadata) {
    const status = STATUS_CODE_BAD_REQUEST;
    data = data ? data : null;
    message = message ? message : getMessage('default.badRequest');
    metadata = metadata ? metadata : {};

    this.status(status);
    this.type(TYPE_JSON);

    return this.json({ message, data, metadata, status: status });
};

const jsonUnauthorized = function (data, message, metadata) {
    const status = STATUS_CODE_UNAUTHORIZED;
    data = data ? data : null;
    message = message ? message : getMessage('default.unauthorized');
    metadata = metadata ? metadata : {};

    this.status(status);
    this.type(TYPE_JSON);

    console.log('right before');
    return this.json({ message, data, metadata, status: status });
};

const jsonNotFound = function (data, message, metadata) {
    const status = STATUS_CODE_NOT_FOUND;
    data = data ? data : null;
    message = message ? message : getMessage('default.notfound');
    metadata = metadata ? metadata : {};

    this.status(status);
    this.type(TYPE_JSON);

    return this.json({ message, data, metadata, status: status });
};

const jsonServerError = function (data, message, metadata) {
    const status = STATUS_CODE_SERVER_ERROR;
    data = data ? data : null;
    message = message ? message : getMessage('default.server.error');
    metadata = metadata ? metadata : {};
    console.log('server error', { data, message, metadata });
    this.status(status);
    this.type(TYPE_JSON);

    return this.json({ message, data, metadata, status: status });
};

export const response = (req, res, next) => {
    res.jsonOK = jsonOK;
    res.jsonBadRequest = jsonBadRequest;
    res.jsonUnauthorized = jsonUnauthorized;
    res.jsonNotFound = jsonNotFound;
    res.jsonServerError = jsonServerError;

    next();
};
