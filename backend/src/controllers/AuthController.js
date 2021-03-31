require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require("../models/user");

const response = require("../common/response");

const jwt = require("../common/jwt");


module.exports = {
    async sign_in(req, res){

        const [hashType, hash] = req.headers.authorization.split(' ');
       
        if(hashType !== "Basic"){
            return res.json(        
                response.jsonUnauthorized(null, null, null)              
            );  
        }

        const [email, password] = Buffer.from(hash, "base64").toString().split(":");

        const user = await User.findOne({ email: email }).select('password')

        const match = user ? await bcrypt.compare(password, user.password) : null;
        
        if(!match){
            return res.json(
                response.jsonBadRequest(null, response.getMessage("badRequest"), null)
            )
        } else{
            const token = jwt.generateJwt({id: user._id});
            const refreshToken = jwt.generateRefreshJwt({id: user._id});
           
            user.password = undefined;
            return res.json(
                response.jsonOK(user, response.getMessage("user.valid.sign_in.sucess"), {token, refreshToken})
            )
        }

      
        
    },

    async activateAccount(req, res){
        const {token} = req.body;

        if(token){
            jwt.verifyAccActivationJwt(token, `${process.env.JWT_ACC_ACTIVATE_TOKEN_PRIVATE_KEY}`, function(err, decodedToken){
                if(err){

                } else{
                    console.log("DecodedToken: " + decodedToken)
                    const supposed_id = CryptoJs.AES.decrypt(decodedToken, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8));
                    User.findById(supposed_id).then(user => {
                        user.active = true;
                            return res.json(
                                response.jsonOK(user, response.getMessage("user.valid.sign_up.sucess"), null)
                            );
                    }).catch(err => {
                        return res.json(
                            response.jsonBadRequest(err, response.getMessage("badRequest"), null)
                        )
                    });       
                   
                }

            });
          

        } else{
            return res.json(
                response.jsonBadRequest(null, response.getMessage("badRequest"), null)
            )
        }
    }


}