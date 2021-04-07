require('dotenv').config();
const jwt = require("jsonwebtoken");

const tokenPrivateKey = `${process.env.JWT_TOKEN_PRIVATE_KEY}`;
const refreshTokenPrivateKey =  `${process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY}`;
const accActivatePrivateKey = `${process.env.JWT_ACC_ACTIVATE_TOKEN_PRIVATE_KEY}`;

const options = { expiresIn: '120 minutes' };
const refreshOptions = { expiresIn: '12 hours' };


module.exports = {
    generateJwt(payload, num) {
        switch (num){
            case 1:
                return jwt.sign(payload, tokenPrivateKey, options);
            case 2:
                return jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);
            case 3:
                return jwt.sign(payload, accActivatePrivateKey, options);
           
            default:
                return null;
        }
        
     
    },
    
    verifyJwt (token, num)  {
        switch (num){
            case 1:
                return jwt.verify(token, tokenPrivateKey);
            case 2:
                return jwt.verify(token, refreshTokenPrivateKey);
            case 3:
                return jwt.verify(token, accActivatePrivateKey);
           
            default:
                return null;
        }
       
    },
    
}