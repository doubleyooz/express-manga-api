require('dotenv').config();

const jwt = require('../common/jwt');
const { getMessage } = require("../common/messages")
const User = require("../models/user");

module.exports = getRole



function getRole(){
    return async (req, res, next) => {
        try{  
                  
            if(req.headers.authorization){
                next()
            } else{

                const [, token] = req.headers.authorization.split(" ")             
           
                if(!token){
                    next()
                } else {
                     
                    let payload = null
                
                    payload = jwt.verifyJwt(token, 1)      
                                
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
                                let dict = {
                                    "": 0,
                                    "Scan": 1,
                                    "User": 2
                                }
                                
                                req.role =  require("crypto-js").AES.encrypt(dict[payload.role].toString(), `${process.env.SHUFFLE_SECRET}`)
                                payload = null
                                dict = null
                                next();
                                
                            }   catch(err){
                                    console.log("something went wrong.")
                                    console.log(err)
                                    next()
                                
                            }           
                            
                        } else{ 
                            next()
                            
                        }
                    }).catch(err =>{
                        next()
                        
                    })
                }
               
                
            }
            
        
                
        } catch(err){            
            next()
            
        }
       
               
     
            
        
        
        
    }
   
    

    

    

}

