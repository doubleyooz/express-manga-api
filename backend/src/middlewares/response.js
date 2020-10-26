const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_UNAUTHORIZED = 401;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_SERVER_ERROR = 500;

const TYPE_JSON = 'application/json';

const jsonOK = function(data, message, metadata) {

    this.status(STATUS_CODE_OK);
    this.type(TYPE_JSON);

    data = (data) ? data : null;
    message = (message) ? message : 'Successful request.';
    metadata = (metadata) ? metadata : {};  

    return this.json({ message, data, metadata, status: STATUS_CODE_OK })  
};

const jsonBadRequest = function(data, message,  metadata){
    this.status(STATUS_CODE_BAD_REQUEST);
    this.type(TYPE_JSON);

    data = (data) ? data : null;
    message = (message) ? message : 'Bad request.';
    metadata = (metadata) ? metadata : {};
    
    return this.json({ message, data, metadata, status: STATUS_CODE_BAD_REQUEST })
};

const jsonUnauthorized = function(data, message,  metadata){

    this.status(STATUS_CODE_UNAUTHORIZED);
    this.type(TYPE_JSON);
    data = (data) ? data : null;
    message = (message) ? message : 'Unauthorized request.';
    metadata = (metadata) ? metadata : {};

    return this.json({ message, data, metadata, status: STATUS_CODE_UNAUTHORIZED })
};

const jsonNotFound = function(data, message,  metadata){

    this.status(STATUS_CODE_NOT_FOUND);
    this.type(TYPE_JSON);
    data = (data) ? data : null;
    message = (message) ? message : 'Not Found.';
    metadata = (metadata) ? metadata : {};

    return this.json({ message, data, metadata, status: STATUS_CODE_NOT_FOUND })
};   

const jsonServerError = function(data, message,  metadata){
    this.status(STATUS_CODE_SERVER_ERROR);
    this.type(TYPE_JSON);

    data = (data) ? data : null;
    message = (message) ? message : "It's not you, it's us. Server Error";
    metadata = (metadata) ? metadata : {};

    return this.json({ message, data, metadata, status: STATUS_CODE_SERVER_ERROR })
}  


const response = (req, res, next) => {
    res.jsonOK = jsonOK;
    res.jsonBadRequest = jsonBadRequest;
    res.jsonNotFound = jsonNotFound;
    res.jsonUnauthorized = jsonUnauthorized;
    res.jsonServerError = jsonServerError;
    next();
}

module.exports = response;