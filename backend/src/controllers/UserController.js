require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("../models/user");

const nodemailer = require('nodemailer')
const ProtonMail = require('protonmail-api');
//const smtpTransport = require('nodemailer-smtp-transport');

const response = require("../common/response");
const jwt = require("../common/jwt");


const Protonmail = false;

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
                 
                const activationToken = jwt.generateAccActivationJwt({id: require("crypto-js").AES.encrypt(p1._id.toString(), `${process.env.SHUFFLE_SECRET}`).toString()});
                       
                // async..await is not allowed in global scope, must use a wrapper
                // Generate test SMTP service account from ethereal.email
             

                (async () => {

                  if(Protonmail){
                    console.log("aqui - 0")
                    const pm = await ProtonMail.connect({
                      username: `${process.env.EMAIL_USER}`,
                      password: `${process.env.EMAIL_PASSWORD}`
                    })
                    console.log("aqui - 1")
                    await pm.sendEmail({
                      to: email,
                      subject: response.getMessage("user.activation.account.subject"),
                      body: `
                          <h2>${response.getMessage("user.activation.account.text")}</h2>
                          <p>${process.env.CLIENT_URL}/authentication/activate/${activationToken}</p>
                          
                      `
                    })
                    console.log("aqui - 2")
                    pm.close()
                  } else{
                    
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                      service: "gmail",                     
                      auth: {
                        user:  `${process.env.GMAIL_USER}`, // generated ethereal user
                        pass: `${process.env.GMAIL_PASSWORD}` // generated ethereal password
                      },
                                           
                   
                      tls: {
                        rejectUnauthorized: false
                    }
                
                    });
                  
                    const mailOptions = {
                        from: `${process.env.GMAIL_USER}`, // sender address
                        to: email, // receiver (use array of string for a list)
                        subject: response.getMessage("user.activation.account.subject"), // Subject line
                        html: `
                            <h2>${response.getMessage("user.activation.account.text")}</h2>
                            <a href="${process.env.CLIENT_URL}/authentication/activate/${activationToken}">
                            Activate your account                               
                            <a/>
                           
                        `// plain text body
                      };
                    
                    transporter.sendMail(mailOptions, (err, info) => {
                    if(err)
                        console.log(err)
                    else
                        console.log(info);
                    });
                
                  
                  
                  }
                  
                  
                  
                  
                })().then(info => {
                    console.log(response.getMessage("user.activation.account.activate"))
                    return res.json(                                
                        response.jsonOK(result, response.getMessage("user.activation.account.activate"), null)              
                    );                       
                }).catch(err => {
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("badRequest"), {err})              
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