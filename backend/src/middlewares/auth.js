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
                User.exists({_id: payload.id, active: true}).then(result => {
                    if (result){
                        try{                                
                            
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

