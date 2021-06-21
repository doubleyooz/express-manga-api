const yup = require('yup')
const mongoose = require('mongoose');

const { getMessage } = require("../common/messages");

module.exports = {
    async valid_chapter_store(req, res, next){         
        const { manga_id, number, title } = req.body;        
        
        let schema = yup.object().shape({
            title: yup.string("title must be a string.").strict()                
                .max(40, getMessage("chapter.invalid.title.long")),
            number: yup.number("Must to be a valid number").min(1, 'Must be a positive number').required(),
                               
        })

        try{
            await schema.validate({title, number})
            .catch(function(e) {
                return res.jsonBadRequest(null, null, e)
                
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

    async valid_chapter_index(req, res, next){
        const { manga_id, number, chapter_id } = req.query; 

        let schema = yup.object().shape({
            number: yup.number("Must to be a valid number").min(1, 'Must be a positive number'),
            manga_id: yup.string("genre must be a string.").strict().required(),
           

        })


        let promises = []
       
        if (number){
            promises.push(
                schema.validate({number, manga_id}).then(console.log("number valid")).catch(err => {                    
                    return res.jsonBadRequest(null, null, err.errors)
                })
            )
            
        }     

        if (chapter_id){
            promises.push(
                new Promise((resolve, reject) => {
                    
                    if (mongoose.Types.ObjectId.isValid(chapter_id)) {   
                        if (String(new mongoose.Types.ObjectId(chapter_id)) === chapter_id) {  
                                console.log("chapter_id2")
                                resolve("chapter id valid")
                        } else { 

                            return res.jsonBadRequest(
                                    null,
                                    getMessage("chapter.invalid.id"),
                                    null
                            );
                                
                        } 
                    } else { 

                        return res.jsonBadRequest(
                                null,
                                getMessage("chapter.invalid.id"),
                                null
                        );
                            
                    } 
                })
                
            )
  
        }

        if (manga_id){
            promises.push(
                new Promise((resolve, reject) => {
                    if (mongoose.Types.ObjectId.isValid(manga_id)) {   
                        if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
                            resolve("manga id valid")
                        } else{
                            return res.jsonBadRequest(
                                null,
                                getMessage("manga.invalid.id"),
                                null
                            );
                        }
                    }   else{
                        return res.jsonBadRequest(
                            null,
                            getMessage("manga.invalid.id"),
                            null
                        );
                    }
                  })
                
            )
        }
          
        
        Promise.all(promises).then(() =>         
            next()            
        ).catch(err => {
            console.log("catch")
            return res.jsonBadRequest(null, null, err)       
        });
       
    },

    async valid_chapter_delete(req, res, next){         
                       
        const { manga_id, chapter_id } = req.query;       
    
        console.log(manga_id)
        console.log(chapter_id)

        if (mongoose.Types.ObjectId.isValid(manga_id)) {   
            if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
                if (mongoose.Types.ObjectId.isValid(chapter_id)) {   
                    if (String(new mongoose.Types.ObjectId(chapter_id)) === chapter_id){                        
                        next(); 
                    } 
                            
                        
                    else {
                        console.log("chapter id invalid string")
                        return res.jsonBadRequest(null, getMessage("chapter.invalid.id"), null); 
                    }                           
                        
                } else {
                    console.log("chapter id invalid object")
                    return res.jsonBadRequest(null, getMessage("chapter.invalid.id"), null);
                }               
                
                                        
            } else {
                console.log("manga id invalid string")
                return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
            }
            
                                        
        } else{
            console.log("manga id invalid object")
            return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
        }  
        
        
    
                    
    }  
}