import jwtService from "../services/jwt.service.js";
import userService from "../services/users.service.js";
import {
  STATUS_CODE_SERVER_ERROR,
  STATUS_CODE_UNAUTHORIZED,
} from "../utils/exception.util.js";
const rolesAuth =
  (roles = []) =>
    async (req, res, next) => {
      const [, token] = req.headers.authorization
        ? req.headers.authorization.split(" ")
        : [, ""];

      if ((!token || token === "") && roles.length > 0)
        return res.status(STATUS_CODE_UNAUTHORIZED).json();

      //ensures that roles is an array
      roles = typeof roles === "string" ? [roles] : roles;

      try {
        const [payload, newToken] = jwtService.verifyJwt(token);

        //Invalid roles
        if (roles.length && !roles.includes(payload.role))
          return res.status(STATUS_CODE_UNAUTHORIZED).json();

        const user = await userService.findAll(
          {
            _id: payload._id,
            active: true,
            tokenVersion: payload.tokenVersion,
          },
          false
        );

        if (!user) return res.status(STATUS_CODE_UNAUTHORIZED).json();
        req.newToken = newToken;
        req.auth = payload._id;

        return next();
      } catch (err) {
        console.log("server error", err);
        if (err.name === "TokenExpiredError")
          return res.status(STATUS_CODE_UNAUTHORIZED).json();
        //Server error
        return res.status(STATUS_CODE_SERVER_ERROR).json();
      }
    };

const bypassAll = async (req, res, next) => {
  const [, token] = req.headers.authorization
    ? req.headers.authorization.split(" ")
    : [, ""];

  try {
    const [payload, newToken] = jwtService.verifyJwt(token);
    console.log({ payload, newToken });
    //Invalid roles
    if (!payload) return next;

    const user = await userService.findAll({
      _id: payload._id,
      active: true,
      tokenVersion: payload.tokenVersion,
    }, false);

    if (!user) return next();
    req.newToken = newToken;
    req.auth = payload._id;

    return next();
  } catch (err) {
    console.log("server error", err);
    //Server error
    return next();
  }
};

export { rolesAuth, bypassAll };
