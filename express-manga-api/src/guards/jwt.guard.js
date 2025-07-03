import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import jwtService from "../services/jwt.service.js";
import userService from "../services/users.service.js";

function rolesAuth(roles = []) {
  return async (req, res, next) => {
    const token = jwtService.getBearerToken(req);

    if ((!token || token === "") && roles.length > 0)
      return res.status(HttpStatusCodes.UNAUTHORIZED).json();

    // ensures that roles is an array
    roles = typeof roles === "string" ? [roles] : roles;

    try {
      const [payload, newToken] = jwtService.verifyJwt(token);

      // Invalid roles
      if (roles.length && !roles.includes(payload.role))
        return res.status(HttpStatusCodes.UNAUTHORIZED).json();

      const user = await userService.findAll(
        {
          _id: payload._id,
          active: true,
          tokenVersion: payload.tokenVersion,
        },
        false,
      );

      if (!user)
        return res.status(HttpStatusCodes.UNAUTHORIZED).json();
      req.newToken = newToken;
      req.auth = payload._id;

      return next();
    }
    catch (err) {
      if (err.name === "TokenExpiredError")
        return res.status(HttpStatusCodes.UNAUTHORIZED).json();
      // Server error
      console.log("server error", err);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  };
}

async function bypassAll(req, res, next) {
  const token = jwtService.getBearerToken(req);

  try {
    const [payload, newToken] = jwtService.verifyJwt(token);
    console.log({ payload, newToken });
    // Invalid roles
    if (!payload)
      return next;

    const user = await userService.findAll({
      _id: payload._id,
      active: true,
      tokenVersion: payload.tokenVersion,
    }, false);

    if (!user)
      return next();
    req.newToken = newToken;
    req.auth = payload._id;

    return next();
  }
  catch (err) {
    console.log("server error", err);
    // Server error
    return next();
  }
}

export { bypassAll, rolesAuth };
