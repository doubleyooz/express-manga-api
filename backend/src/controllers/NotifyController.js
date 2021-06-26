require('dotenv').config();

const nodemailer = require('nodemailer')
const ProtonMail = require('protonmail-api');

const User = require("../models/user");
const Manga = require("../models/manga");
const Chapter = require("../models/chapter");

const Protonmail = false;

module.exports = {
    async notifyUsers(req, res){                              
        const { manga_id } = req.query;

        const manga = await Manga.findById(manga_id).select({user_alert: 1, title: 1})

        if(!manga){
            return res.jsonNotFound(null, getMessage("manga.notfound"), null)        
        }

        const oneday = 60 * 60 * 24 * 1000 

        const chapters = await Chapter.find({
            created_At: {
                $gte: Date.now() - oneday,
                $lt: Date.now() 
            },
            manga_id: manga_id 
        })

        if(!chapters){
            return res.jsonNotFound(null, getMessage("chapter.list.empty"), null)     
        }

        let success, failed = 0
        manga.user_alert.forEach((user_id, i) => {
            let user = await User.findById(user_id).select({email: 1})
            if(user){                


                (async () => {

                    if(Protonmail){
                        console.log("aqui - 0")
                        const pm = await ProtonMail.connect({
                            username: `${process.env.EMAIL_USER}`,
                            password: `${process.env.EMAIL_PASSWORD}`
                        })
                        console.log("aqui - 1")
                        await pm.sendEmail({
                            to: user.email,
                            subject: getMessage("user.email.notification.manga.subject"),
                            body: `
                                <h2>${manga.title} ${getMessage("user.email.notification.manga.text")}</h2>

                              
                                ${chapters.forEach((chapter, index) => {
                                    return ` <a href="${process.env.CLIENT_URL}/${index}">
                                        ${getMessage("user.email.notification.manga.text.url")}                               
                                    <a/>`
                                })}
                                
                                <div>
                                    <h4>${getMessage("user.email.notification.manga.text.warning")}</h4>
                                    
                                    <a href="${process.env.CLIENT_URL}">
                                        ${getMessage("user.email.notification.manga.text.warning.url")}                               
                                    <a/>
                                </div>

                                
                            `
                        })
                        
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
                            to: user.email, // receiver (use array of string for a list)
                            subject: getMessage("user.email.notification.manga.subject"), // Subject line
                            html: `
                                <h2>${manga.title} ${getMessage("user.email.notification.manga.text")}</h2>

                                
                                ${chapters.forEach((chapter, index) => {
                                    return ` <a href="${process.env.CLIENT_URL}/${index}/${chapter.title}">
                                        ${getMessage("user.email.notification.manga.text.url")}                               
                                    <a/>`
                                })}
                               
                                
                                <div>
                                    <h4>${getMessage("user.email.notification.manga.text.warning")}</h4>
                                    
                                    <a href="${process.env.CLIENT_URL}">
                                        ${getMessage("user.email.notification.manga.text.warning.url")}                               
                                    <a/>
                                </div>
                            
                               
                                
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
                    success+=1
                    console.log(getMessage("manga.notify.success"))
                                 
                                        
                }).catch(err => {
                    failed+=1
                                
                    
                }) 
            }
            
        })
        
        return res.jsonOK(
            {"users notified": success, "users not notified": failed},
            getMessage("manga.notify.success"),
            null
        ) 
             
                                             
    },

}