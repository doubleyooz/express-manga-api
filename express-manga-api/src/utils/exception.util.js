import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

export const TYPE_JSON = "application/json";


export class CustomException extends Error {
  status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  name = this.constructor.name;
  constructor(message) {
    super(message);
  }
}

export class UnprocessableEntityException extends CustomException {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = HttpStatusCodes.UNPROCESSABLE_ENTITY;
  }
}

export class InternalServerErrorException extends CustomException {
  constructor(message = HttpStatusMessages.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export class BadRequestException extends CustomException {
  constructor(message = HttpStatusMessages.BAD_REQUEST) {
    super(message);
    this.name = this.constructor.name;
    this.status = HttpStatusCodes.BAD_REQUEST;
  }
}

export class UnauthorisedException extends CustomException {
  constructor(message = HttpStatusMessages.UNAUTHORIZED) {
    super(message);
    this.name = this.constructor.name;
    this.status = HttpStatusCodes.UNAUTHORIZED;
  }
}

export class NotFoundException extends CustomException {
  constructor(message = HttpStatusMessages.NOT_FOUND) {
    super(message);
    this.name = this.constructor.name;
    this.status = HttpStatusCodes.NOT_FOUND;
  }
}
