require('dotenv').config();
const jwt = require('../common/jwt');
const response = require('../common/response');
const User = require("../models/user");

module.exports = auth

function auth(roles = []){
    return async (req, res, next) => {
        const [, token] = req.headers.authorization.split(" ")
        if (typeof roles === 'string') {
            roles = [roles];
        }
               
    
        let payload = jwt.verifyJwt(token, 1)        
        
        if (roles.length && !roles.includes(payload.role)){          
            return res.json( 
                response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
            )
            
        } else{
            User.exists({_id: payload.id, active: true}).then(result => {
                if (result){
                    try{                                
                        req.auth = require("crypto-js").AES.encrypt(payload.id, `${process.env.SHUFFLE_SECRET}`);
                        next();
                        
                    }   catch(err){
                        console.log(err)
                        return res.json(
                            response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
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

    
        
            
      
        
        
    }
   
    

    

    

}

