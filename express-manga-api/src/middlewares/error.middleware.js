import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";
import {
  CustomException,
} from "../utils/exception.util.js";

function errorHandler(err, req, res, next) {
  console.log("error handler in anction");
  console.error(err.stack);
  if (err instanceof CustomException)
    return res.status(err.status).json({ message: err.message, data: [] });

  const errorMessage = err && err.message ? err.message : err;
  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage, message: HttpStatusMessages.INTERNAL_SERVER_ERROR });
}

export { errorHandler };
