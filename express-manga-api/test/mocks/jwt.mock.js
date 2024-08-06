import jwt from "../../src/services/jwt.service";

const userToken = (_id) => {
  return jwt.generateJwt(
    {
      _id: _id,
      role: "User",
      token_version: 0,
    },
    1
  );
};

const scanToken = (_id) => {
  return jwt.generateJwt(
    {
      _id: _id,
      role: "Scan",
      token_version: 0,
    },
    1
  );
};

const corruptedToken = (_id) => {
  return jwt.generateJwt(
    {
      _id: _id,
      role: "",
      token_version: 0,
    },
    2
  );
};

export { userToken, scanToken, corruptedToken };
