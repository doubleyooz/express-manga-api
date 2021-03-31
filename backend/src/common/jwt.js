require('dotenv').config();
const jwt = require("jsonwebtoken");

const tokenPrivateKey = `${process.env.JWT_TOKEN_PRIVATE_KEY}`;
const refreshTokenPrivateKey =  `${process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY}`;
const accActivatePrivateKey = `${process.env.JWT_ACC_ACTIVATE_TOKEN_PRIVATE_KEY}`;

const options = { expiresIn: '120 minutes' };
const refreshOptions = { expiresIn: '12 hours' };


module.exports = {
    generateJwt(payload) {
        return jwt.sign(payload, tokenPrivateKey, options);
    },
    
    verifyJwt (token)  {
        return jwt.verify(token, tokenPrivateKey )
    },
        
    generateRefreshJwt (payload) {
        return jwt.sign(payload, refreshTokenPrivateKey, options);
    },
    
    verifyRefreshJwt (token) {
        return jwt.verify(token, refreshTokenPrivateKey)
    },

    generateAccActivationJwt(payload) {
        return jwt.sign(payload, accActivatePrivateKey, options);
    },
    
    verifyAccActivationJwt (token)  {
        return jwt.verify(token, accActivatePrivateKey)
    },
}