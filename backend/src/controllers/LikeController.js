require('dotenv').config();

const CryptoJs = require("crypto-js");

const Manga = require('../models/Manga');
const User = require("../models/user");
const { getMessage } = require("../common/messages")


module.exports = {
    async likeUser(req, res){
        const { scan_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null
        
        const current_user = CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null             

        const scan = await User.findById(scan_id)

        if(!scan){
            return res.jsonNotFound(null, getMessage("user.notfound"), new_token)        
        }

        if(scan.role === "User"){
            return res.jsonBadRequest(null, null, new_token)
        }
        
        scan.likes.includes(current_user) ? 
        scan.likes = scan.likes.filter(function (_id){ return _id.toString() !== current_user.toString() }) :
        scan.likes.push(current_user)
              
        scan.updatedAt = Date.now()      

        let changes = scan.getChanges()
        

        scan.save().then(() => {  
            User.findById(current_user).then(user => {
                user.likes.includes(scan_id) ? 
                user.likes = user.likes.filter(function (_id){ return _id.toString() !== scan_id.toString() }) :
                user.likes.push(scan_id)

                user.save().then(answer =>{
                    console.log(answer)
                    return res.jsonOK(changes, getMessage("user.like.success"), new_token)
                }).catch(err => {   
                    console.log(err)         
                    return res.jsonServerError(null, null, err.toString())
                })
               
            }).catch(err => {   
                console.log(err)         
                return res.jsonServerError(null, null, err.toString())
            })
           

        }).catch(err => {   
            console.log(err)         
            return res.jsonServerError(null, null, err.toString())
        })
       


    },

    async likeManga(req, res){
        const { manga_id } = req.query;
        
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null
        
        const current_user = CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null             

        const manga = await Manga.findById(manga_id)

        if(!manga){
            return res.jsonNotFound(null, getMessage("manga.notfound"), new_token)        
        }

        const user = await User.findById(current_user)

        if(!user){
            return res.jsonNotFound(null, getMessage("user.notfound"), new_token)        
        }

        manga.likes.includes(current_user) ? 
            manga.likes = manga.likes.filter(function (_id){ return _id.toString() !== current_user.toString() }) :
            manga.likes.push(current_user)
       
        manga.updatedAt = Date.now()      

        user.mangas.includes(manga_id) ? 
            user.mangas = user.mangas.filter(function (_id){ return _id.toString() !== manga_id.toString() }) :
            user.mangas.push(manga_id)

        let changes = user.getChanges()
        

        manga.save().then(() => {
            user.save().then(() => {
                
                return res.jsonOK(changes, getMessage("manga.like.success"), new_token)

            }).catch(err => {
                console.log(err)         
                return res.jsonServerError(null, null, err.toString())

            })
                       
        }).catch(err => {   
            console.log(err)         
            return res.jsonServerError(null, null, err.toString())

        })
    }
}