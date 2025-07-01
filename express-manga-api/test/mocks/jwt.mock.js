import jwt from "../../src/services/jwt.service";

function userToken(_id) {
  return jwt.generateJwt(
    {
      _id,
      role: "User",
      token_version: 0,
    },
    1,
  );
}

function scanToken(_id) {
  return jwt.generateJwt(
    {
      _id,
      role: "Scan",
      token_version: 0,
    },
    1,
  );
}

function corruptedToken(_id) {
  return jwt.generateJwt(
    {
      _id,
      role: "",
      token_version: 0,
    },
    2,
  );
}

export { corruptedToken, scanToken, userToken };
