const yup = require('yup')
const mongoose = require('mongoose');

const { getMessage } = require("../common/messages");

module.exports = {
    async valid_manga_store(req, res, next){         
                       
        const { title, genre, synopsis, n_chapters, status, nsfw, language } = req.body;  
        
        
        console.log(title)

        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict().min(2, 'title must be between 2-60 characters.').max(60, 'title must be between 2-60 characters.').required(),
            genre: yup.string("genre must be a string.").strict().required(),
            synopsis: yup.string("synopsis must be a string.").strict().min(10, 'synopsis must be between 10-400 characters.').max(400, 'synopsis must be between 10-400 characters.').required(),
            n_chapters: yup.number("chapters must be a number.").min(1, 'There must be at least one chapter.').required(),
            status: yup.number("status must be a number.").min(1, 'Invalid code.').max(6, 'Invalid code.').required(),
            nsfw: yup.bool("nsfw must be a boolean.").strict().required(),
            language: yup.string("language must be a string.").strict().default({ language: 'pt' }).required(),
           
        })

        try{
            await schema.validate({title, genre, synopsis, n_chapters, status, nsfw, language})
            .catch(function(e) {
                return res.jsonBadRequest(null, "you did not give us want we want", null)
                
            });

            valid_scan = true;

            valid_language = true;
    
            valid_genre = true;
    
            if (valid_scan && valid_language && valid_genre){
                next();
            
            } else{
                return res.jsonBadRequest(null, "unregistered scan", null)
                
            }

        } catch(err){
            return res.jsonBadRequest(null, null, err)
            
        }
              
                        
    },

    async valid_manga_index(req, res, next){
        const { title, genre, scan } = req.query;
        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict(),
            genre: yup.string("genre must be a string.").strict(),
            scan: yup.string("scan must be a string.").strict(),

        })

        try{
            await schema.validate({title, genre, scan})
            .catch(function(e) {
                return res.jsonBadRequest(null, "you did not give us want we want", e.errors)
                
            });

            if(genre)
                valid_genre = true; //validate genre

            if (scan)
                valid_scan = true;  //validate scan        
    
            
    
            if (valid_scan && valid_genre){
                next();
            
            } else{
                return res.jsonBadRequest(null, "unregistered scan", null)
                
            }

        } catch(err){
           
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
                        "You need to provide a valid IdObject to continue this operation.",
                        null);
               
            } 
        } else {
            return res.jsonBadRequest(
                    null,
                    "You need to provide a valid IdObject to continue this operation.",
                    null);         
        }                     
    }  
}