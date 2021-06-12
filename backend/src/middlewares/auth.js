require('dotenv').config();
const { generateJwt } = require('../common/jwt');
const jwt = require('../common/jwt');
const response = require('../common/response');
const User = require("../models/user");

module.exports = auth



function auth(roles = []){
    return async (req, res, next) => {
        try{          
            const [, token] = req.headers.authorization.split(" ")
            if (typeof roles === 'string') {
                roles = [roles];
            }
            console.log(token)
            let payload = null
            try{
                payload = jwt.verifyJwt(token, 1)  
                
            
            }catch(err){ 
                //Invalid Token            
                return res.json( 
                    response.jsonUnauthorized(err, response.getMessage("Unauthorized"), null)
                )
            }

            if (roles.length && !roles.includes(payload.role)){   
                //Invalid roles       
                return res.json( 
                    response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
                )
                
            } else{                
                User.exists({_id: payload.id, active: true, token_version: payload.token_version}).then(result => {
                    if (result){
                        try{                                
                            var current_time = Date.now().valueOf() / 1000;
                            console.log(payload)
                            console.log(payload.exp - payload.iat)
                            console.log(payload.exp - current_time)
                            console.log(current_time)
                            if ((payload.exp - payload.iat)/2 > payload.exp - current_time) {
                                let new_token = jwt.generateJwt({id: payload.id, role: payload.role, token_version: payload.token_version}, 1)
                                req.new_token = `Bearer ${new_token}`
                                console.log(`New Token: ${new_token}`)
                            } else{
                                console.log("Token not expired")
                            }
                            req.auth = require("crypto-js").AES.encrypt(payload.id, `${process.env.SHUFFLE_SECRET}`);
                            payload = null
                            next();
                            
                        }   catch(err){
                            console.log(err)
                            //Server error
                            return res.json(
                                response.jsonServerError(null, null, null)
                            )
                        }           
                        
                    } else{ 
                        return res.json( 
                            response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
                        )
                    }
                }).catch(err =>{
                    return res.json( 
                        response.jsonUnauthorized(null, response.getMessage("Unauthorized"), err)
                    )
                })
            
            }    
        } catch(err){
            return res.json( 
                response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
            )
        }
       
               
     
            
        
        
        
    }
   
    

    

    

}

