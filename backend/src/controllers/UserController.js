require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const User = require("../models/user");

const response = require("../common/response");

const jwt = require("../common/jwt");


module.exports = {
    async store(req, res){                              
        const [hashType, hash] = req.headers.authorization.split(' ');
       
        if(hashType !== "Basic"){
            return res.json(        
                response.jsonUnauthorized(null, null, null)              
            );  
        }

        const [email, password] = Buffer.from(hash, "base64").toString().split(":");
      
        if(email && password){                       
            const salt = bcrypt.genSaltSync(10);
            const _hash = bcrypt.hashSync(password, salt);
            
            const p1 = new User ({
                email: email,
                password: _hash
                
            });

            p1.save().then(result => {

                const token = jwt.generateJwt({id: p1._id});
                const refreshToken = jwt.generateRefreshJwt({id: p1._id});
                
                result.password = undefined
                res.json(        
                    response.jsonOK(result, response.getMessage("user.valid.sign_up.sucess"), {token, refreshToken})              
                );                              

            }).catch(err => {
                
                console.log(err)
                if (err.name === 'MongoError' && err.code === 11000) {
                    //next(new Error('There was a duplicate key error'));
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("user.error.sign_up.duplicatekey"), {err})              
                    );  
                
                } else {
                    return res.json(        
                        response.jsonBadRequest(null, null, {err})              
                    );  
                
                }       
                    
            });     
        
        } 
        else{
            return res.json(        
                response.jsonBadRequest(null, response.getMessage("badRequest"), null)              
            ); 
        }                                                                     
    },

    async index(req, res){
        
        const { email } = req.query;
       
        let docs = [];

        if (email){
            (await User.find( {email: {$regex: email, $options: "i"} } )).forEach(function (doc){
                docs.push(doc)
            });
        }


        else{
            (await User.find()).forEach(function (doc){
                docs.push(doc)
            });     
        }
          

        console.log(docs)
        res.json(        
            response.jsonOK(docs, `Page list retrieved successfully! Users found: ${docs.length}`, null)              
        );
    },

    async delete(req, res){
    
        const { user_id } = req.query;
        console.log(user_id)

        User.findOne({ _id: user_id }).then(result =>  {
            User.deleteOne({ _id: user_id }, function (err) {
                if (err){
                    return res.json(        
                        response.jsonNotFound(null, "The specified user could not be deleted", err.message)              
                    )  
                } else {
                    return res.json(        
                        response.jsonOK(null, "The specified user was deleted", result)              
                    )  
                  }
                   
                // deleted at most one tank document
                });  
        }).catch(err => {
            return res.json(        
                response.jsonNotFound(null, "The specified user could not be found", err.message)              
            )             
        })

             
    },

    async auth(req, res){

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
           
            return res.json(
                response.jsonOK(user, response.getMessage("user.valid.sign_in.sucess"), {token, refreshToken})
            )
        }

           
        
    }
}