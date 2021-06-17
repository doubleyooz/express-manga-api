require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CryptoJs = require("crypto-js")
const jwt = require("../common/jwt");

const { getMessage } = require("../common/messages")
const User = require("../models/user");




module.exports = {

    async refreshAccessToken(req, res){
      
        const refreshToken = req.cookie.jid
        if(!refreshToken){
            return res.jsonUnauthorized(null, getMessage("unauthorized.refresh.token.missing"), null)
            
        }
        console.log(refreshToken)
        let payload = null;
        try{
            payload = jwt.verifyJwt(refreshToken, 2)

        }catch(err){
            console.log(err)
            return res.jsonUnauthorized(null, null, null)
            
        }
        User.findOne({_id: payload.id, active: true}).then(result => {
            if (result){
                try{
                    const accessToken = jwt.generateJwt({
                        id: result._id,
                        role: result.role,
                        token_version: result.token_version}
                    , 1) 
                                              
                    return res.jsonOK(null, {accessToken: accessToken}, null)
                    

                    
                }   catch(err){
                    console.log(err)
                    return res.jsonUnauthorized(null, null, null)
                    
                }           
                
            } else{ 
                return res.jsonUnauthorized(null, null, null)
                
            }
        }).catch(err =>{
            return res.jsonUnauthorized(null, null, err)
            
        })

    
    
    },
    

    async sign_in(req, res){        
        const [hashType, hash] = req.headers.authorization.split(' ');
       
        if(hashType !== "Basic"){
            return res.jsonUnauthorized(null, null, null)              
             
        }
      
        const [email, password] = Buffer.from(hash, "base64").toString().split(":");

        const user = await User.findOne({ email: email, active: true }).select(['password', 'role', 'token_version'])
        
    
        const match = user ? await bcrypt.compare(password, user.password) : null;
        
        if(!match){
            return res.jsonBadRequest(null, null, null)
            
        } else{
            
            const token = jwt.generateJwt({id: user._id, role: user.role, token_version: user.token_version}, 1);
            const refreshToken = jwt.generateJwt({id: user._id, role: user.role, token_version: user.token_version}, 2);
            
            req.headers.authorization = `Bearer ${token}`           
            res.cookie('jid', refreshToken, { httpOnly: true, path: "/refresh-token"})
            
            user.password = undefined;
            return res.jsonOK(user, getMessage("user.valid.sign_in.success"), {token})
            
        }
    
        

      
        
    },

    async activateAccount(req, res){
        const token = req.params.tky;       
        if(token){                      
            try{
                const decodedToken = jwt.verifyJwt(token, 3)
                if(decodedToken){
                    console.log("DecodedToken: " + decodedToken.id)
                    const supposed_id = CryptoJs.AES.decrypt(decodedToken.id, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8));
                    User.findById(supposed_id).then(user => {
                        if(user.active){
                            console.log("user.active")
                            return res.jsonBadRequest(
                                    null,
                                    getMessage("user.activation.error.already.activated"),
                                    null
                                )
                            
                            
                        }
                        user.active = true;
                        user.save().then(savedDoc => {
                            if(savedDoc === user){
                                                               
                                return res.jsonOK(user, getMessage("user.valid.sign_up.success"), null)
                                
                            } else{
                               
                                return res.jsonServerError(user, null, null)
                            
                            }                                                 
                        });                       
                           
                    }).catch(err => {                        
                        return res.jsonBadRequest(err, null, null)
                        
                    });                          
                } else{
                    return res.jsonBadRequest(null, null, null)
                    
                }
            
            }catch(err){
                return res.jsonUnauthorized(err, null, null)
                
            };
          

        } else{
            return res.jsonBadRequest(null, null, null)
            
        }
    },
    //missing test
    async changeEmail(req, res){
        const token = req.params.tky;
      
        if(token){
            const decodedToken = await jwt.verifyJwt(token, 5)
        
            if(decodedToken){
               
                const supposed_id = CryptoJs.AES.decrypt(decodedToken.id, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8));
              
                User.findById(supposed_id).then(user => {
                    const email = CryptoJs.AES.decrypt(decodedToken.email, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8));
                    if(email){
                        user.email = email;
                        user.save().then(savedDoc => {
                            if(savedDoc === user){
                                return res.jsonOK(user, getMessage("user.update.email.success"), null)
                                
                            } else{
                                return res.jsonServerError(user, null, null)
                            
                            }                                              
                        });
                    }
                               
                    else{
                        return res.jsonBadRequest(null, null, null)
                        
                    }                                           
                }).catch(err => {
                    return res.jsonBadRequest(err, null, null)
                    
                });                          
            } else{                
                return res.jsonBadRequest(err, null, null)
                
            }           
        }
    },

    //working on
    async recoverPassword(req, res){
        const token = req.params.tky;
        
        if(token){
            console.log("token exists")
            const decodedToken = await jwt.verifyJwt(token, 4)
            
                if(decodedToken){
                    console.log("DecodedToken: " + decodedToken.id)
                    const supposed_id = CryptoJs.AES.decrypt(decodedToken.id, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8));
                    User.findById(supposed_id).then(user => {
                       
                        user.save().then(savedDoc => {
                            if(savedDoc === user){
                                return res.jsonOK(user, getMessage("user.valid.sign_up.success"), null)
                                
                            } else{
                                return res.jsonServerError(user, null, null)
                            
                            }                                                
                          });                      
                    }).catch(err => {
                        return res.jsonBadRequest(err, null, null)
                        
                    });                          
                } else{                    
                    return res.jsonBadRequest(null, null, null)
                    
                }           

        } else{
            return res.jsonBadRequest(null, null, null)
            
        }
    }
}