require('dotenv').config();

const jwt = require('../common/jwt');
const { getMessage } = require("../common/messages")
const User = require("../models/user");

module.exports = auth



function auth(roles = []){
    return async (req, res, next) => {
        try{          
            const [, token] = req.headers.authorization.split(" ")
            if (typeof roles === 'string') {
                roles = [roles];
            }
            
            let payload = null
            try{
                payload = jwt.verifyJwt(token, 1)  
                
            
            }catch(err){ 
                //Invalid Token            
                return res.jsonUnauthorized(err, null, null)
                
            }

            

            if (roles.length && !roles.includes(payload.role)){   
                //Invalid roles       
                return res.jsonUnauthorized(null, null, null)
                
                
            } else{                
                User.exists({_id: payload.id, active: true, token_version: payload.token_version}).then(result => {
                    if (result){
                        try{                                
                            var current_time = Date.now().valueOf() / 1000;                           
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
                            return res.jsonServerError(null, null, null)
                            
                        }           
                        
                    } else{ 
                        return res.jsonUnauthorized(null, null, null)
                        
                    }
                }).catch(err =>{
                    return res.jsonUnauthorized(null, null, err)
                    
                })
            
            }    
        } catch(err){
            return res.jsonUnauthorized(null, null, null)
            
        }
       
               
     
            
        
        
        
    }
   
    

    

    

}

