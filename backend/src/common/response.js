import * as messages from './message.json';

const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_UNAUTHORIZED = 401;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_SERVER_ERROR = 500;




module.exports = {
  getMessage(key) {
    return messages[key] || null;
  },
  
  jsonOK(data, message, metadata) {        
    data = (data) ? data : null;
    message = (message) ? message : 'Successful request.';
    metadata = (metadata) ? metadata : {};  

    return ({ message, data, metadata, status: STATUS_CODE_OK })  
  },

  jsonBadRequest(data, message, metadata){
      data = (data) ? data : null;
      message = (message) ? message : 'Bad request.';
      metadata = (metadata) ? metadata : {};
      
      return ({ message, data, metadata, status: STATUS_CODE_BAD_REQUEST })
  },

  jsonUnauthorized(data, message, metadata){
    data = (data) ? data : null;
    message = (message) ? message : 'Unauthorized request.';
    metadata = (metadata) ? metadata : {};
    
    return ({ message, data, metadata, status: STATUS_CODE_UNAUTHORIZED })
  },

  jsonNotFound(data, message, metadata){
    data = (data) ? data : null;
    message = (message) ? message : 'Not Found.';
    metadata = (metadata) ? metadata : {};
    
    return ({ message, data, metadata, status: STATUS_CODE_NOT_FOUND })
  },    


  jsonServerError(data, message, metadata){
    data = (data) ? data : null;
    message = (message) ? message : "It's not you, it's us. Server Error";
    metadata = (metadata) ? metadata : {};
    
    return ({ message, data, metadata, status: STATUS_CODE_SERVER_ERROR })
  }  
}