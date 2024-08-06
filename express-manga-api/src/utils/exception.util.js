import { getMessage } from "./message.util.js";

export const TYPE_JSON = "application/json";
export const STATUS_CODE_OK = 200;
export const STATUS_CODE_BAD_REQUEST = 400;
export const STATUS_CODE_UNAUTHORIZED = 401;
export const STATUS_CODE_NOT_FOUND = 404;
export const STATUS_CODE_UNPROCESSABLE_ENTITY = 422;
export const STATUS_CODE_SERVER_ERROR = 500;

export class CustomException extends Error {
  status = STATUS_CODE_SERVER_ERROR;
  name = this.constructor.name;
  constructor(message) {
    super(message);
  }
}

export class UnprocessableEntityException extends CustomException {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = STATUS_CODE_UNPROCESSABLE_ENTITY;
  }
}

export class InternalServerErrorException extends CustomException {
  constructor(message = getMessage("default.server.error")) {
    super(message);
    this.name = this.constructor.name;
    this.status = STATUS_CODE_SERVER_ERROR;
  }
}

export class BadRequestException extends CustomException {
  constructor(message = getMessage("default.badRequest")) {
    super(message);
    this.name = this.constructor.name;
    this.status = STATUS_CODE_BAD_REQUEST;
  }
}

export class UnauthorisedException extends CustomException {
  constructor(message = getMessage("default.unauthorized")) {
    super(message);
    this.name = this.constructor.name;
    this.status = STATUS_CODE_UNAUTHORIZED;
  }
}

export class NotFoundException extends CustomException {
  constructor(message = getMessage("default.notfound")) {
    super(message);
    this.name = this.constructor.name;
    this.status = STATUS_CODE_NOT_FOUND;
  }
}
