require('dotenv').config();
const jwt = require('../common/jwt');
const response = require('../common/response');
const User = require("../models/user");

module.exports = {
  
    async auth(req, res, next){
        try{
            const [, token] = req.headers.authorization.split(" ")
            
            try{
                const payload = await jwt.verifyJwt(token, 1);
                                
                if(await User.exists({_id: payload.id, active: true})){    
                    try{                                
                        req.auth = require("crypto-js").AES.encrypt(payload.id, `${process.env.SHUFFLE_SECRET}`);
                        next();
                        
                    }   catch(err){
                        console.log(err)
                        return res.json(
                            response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
                        )
                    }           
                 
                }
                else{ 
                    return res.json( 
                        response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
                    )
                }

            } catch(err){
                return res.json(
                    response.jsonUnauthorized(null, response.getMessage("Unauthorized"), err.errors)
                )
            }
        } catch(err){
            return res.json(
                response.jsonUnauthorized(null, response.getMessage("Unauthorized"), err.errors)
            )
        }
       

    },

}