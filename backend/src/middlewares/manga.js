const yup = require('yup')
const mongoose = require('mongoose');

const { getMessage } = require("../common/messages");

module.exports = {
    async valid_manga_store(req, res, next){         
                       
        const { title, genre, synopsis, n_chapters, status, nsfw, language } = req.body;  
        
        
        console.log(title)
       
        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict().min(2, getMessage("manga.invalid.title.short")).max(60, getMessage("manga.invalid.title.long")).required(),
            genre: yup.string("genre must be a string.").strict().required(),
            synopsis: yup.string("synopsis must be a string.").strict().min(10, getMessage("manga.invalid.synopsis.short")).max(400, getMessage("manga.invalid.synopsis.long")).required(),
            n_chapters: yup.number("chapters must be a number.").min(1, 'There must be at least one chapter.').required(),
            status: yup.number("status must be a number.").min(1, getMessage("manga.invalid.code")).max(6, getMessage("manga.invalid.code")).required(),
            nsfw: yup.string("nsfw must be a string.").strict().matches(/(true|false)/, null).required(),
            language: yup.string("language must be a string.").strict().matches(/(pt-br|en-us|en-uk)/, null).default({ language: 'pt-br' }).required(),
           
        })

       

        schema.validate({title, genre, synopsis, n_chapters, status, nsfw, language}).then(() => {
            valid_language = true;

            valid_genre = true;
    

            if (valid_language && valid_genre && req.file){
                req.nsfw = (nsfw === "true")
                next();
            
            } else{
                return res.jsonBadRequest(null, null, null)
                
            }
        })
        .catch(function(e) {
            console.log(e)
            return res.jsonBadRequest(null, null, e)
            
        });
        
        

    
              
                        
    },

    async valid_manga_index(req, res, next){
        const {manga_id} = req.query

        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict(),
            genre: yup.string("genre must be a string.").strict(),
            scan: yup.string("scan must be a string.").strict(),

        })

        
        

        try{
            schema.validate(req.query).then(() => {
                if(manga_id){
                    if (mongoose.Types.ObjectId.isValid(manga_id)) {   
                        if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {                              
                            next();     
                        } else { 
            
                            return res.jsonBadRequest(
                                    null,
                                    getMessage("manga.invalid.id"),
                                    null);
                           
                        } 
                    } else {
                        return res.jsonBadRequest(
                                null,
                                getMessage("manga.invalid.id"),
                                null);         
                    }              
                }
                      
                else {
                    
                    next();
                    
                }
            
            })
            .catch((err) => {
                return res.jsonBadRequest(null, null, err.errors)              
               
           })
           

        } catch(err){
            return res.jsonBadRequest(null, null, err.errors)
        }
       
    }, 

    async valid_manga_list(req, res, next){
        const {manga_id} = req.query

        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict(),
            genre: yup.string("genre must be a string.").strict(),
            scan: yup.string("scan must be a string.").strict(),

        })

        
        

        try{
            schema.validate(req.query).then(() => {
                if(manga_id){
                    if (mongoose.Types.ObjectId.isValid(manga_id)) {   
                        if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {                              
                            next();     
                        } else { 
            
                            return res.jsonBadRequest(
                                    null,
                                    getMessage("manga.invalid.id"),
                                    null);
                           
                        } 
                    } else {
                        return res.jsonBadRequest(
                                null,
                                getMessage("manga.invalid.id"),
                                null);         
                    }              
                }
                      
                else {
                    
                    next();
                    
                }
            
            })
            .catch((err) => {
                return res.jsonBadRequest(null, null, err.errors)              
               
           })
           

        } catch(err){
            return res.jsonBadRequest(null, null, err.errors)
        }
       
    },

    async valid_manga_delete(req, res, next){         
                       
        const { manga_id } = req.query;       
    
        if (mongoose.Types.ObjectId.isValid(manga_id)) {   
            if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
                next();     
            } else { 

                return res.jsonBadRequest(
                        null,
                        getMessage("manga.invalid.id"),
                        null);
               
            } 
        } else {
            return res.jsonBadRequest(
                    null,
                    getMessage("manga.invalid.id"),
                    null);         
        }                     
    }  
}