const yup = require('yup')
const mongoose = require('mongoose');

const { getMessage } = require("../common/messages");

module.exports = {
    async valid_chapter_store(req, res, next){         
                       
        const { title, manga_id, number } = req.body;  
        
        
        console.log(title)

        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict()
                .min(2, getMessage("chapter.invalid.title.short"))
                .max(40, getMessage("chapter.invalid.title.long")),
            number: yup.number("Must to be a valid number").min(1, 'Must be a positive number').required(),
                               
        })

        try{
            await schema.validate({title, number})
            .catch(function(e) {
                return res.jsonBadRequest(null, null, null)
                
            });

            if (mongoose.Types.ObjectId.isValid(manga_id)) {   
                if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
                    next();     
                } else { 
    
                return res.jsonBadRequest(
                        null,
                        getMessage("manga.invalid.id"),
                        null);
                   
                } 
            }
        

        } catch(err){
            return res.jsonBadRequest(null, null, err)
            
        }
              
                        
    },

    async valid_manga_index(req, res, next){
        
        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict(),
            genre: yup.string("genre must be a string.").strict(),
            scan: yup.string("scan must be a string.").strict(),

        })

        try{
            schema.validate(req.query).then(() => next())
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