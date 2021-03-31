require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const User = require("../models/user");

const response = require("../common/response");

const jwt = require("../common/jwt");


module.exports = {
    async store(req, res){                              
        const {email, password } = req.body;
             
      
        if(email && password){                    
            const salt = bcrypt.genSaltSync(10);
            const _hash = bcrypt.hashSync(password, salt);
            
            const p1 = new User ({
                email: email,
                password: _hash
                
            });

            p1.save().then(result => {    
                result.password = undefined              
                const activationToken = jwt.generateAccActivationJwt({id: require("crypto-js").AES.encrypt(p1._id, `${process.env.SHUFFLE_SECRET}`)});
                       
                // async..await is not allowed in global scope, must use a wrapper
                // Generate test SMTP service account from ethereal.email
                           
            
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: "protonmail",
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: `${process.env.EMAIL_USER}`, // generated ethereal user
                        pass: `${process.env.EMAIL_PASSWORD}`, // generated ethereal password
                    },
                });           
            
                // send mail with defined transport object
                transporter.sendMail({
                    from: response.getMessage("user.activation.account"), // sender address
                    to: email, // list of receivers
                    subject: response.getMessage("user.activation.account.subject"), // Subject line
                    html: `
                    <h2>${response.getMessage("user.activation.account.text")}</h2>
                    <p>${process.env.CLIENT_URL}/authentication/activate/${activationToken}</p>
                    
                    `
                }).then(info => {
                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                    main().catch(console.error);
                    return res.json(        
                        response.jsonOK(result, response.getMessage("user.activation.account.activate"), null)              
                    );                       
                }).catch(err => {
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("user.error.sign_up.duplicatekey"), {err})              
                    );  
                })           
                            

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
                response.jsonNotFound(null, response.getMessage("user.error.notfound"), err.message)              
            )             
        })

             
    },

}