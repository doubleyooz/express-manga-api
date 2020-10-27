

module.exports = {
    valid_manga_store(req, res, next){         
                       
        const { title, genre, synopsis, chapters, status, scan, language } = req.body;  
        
        valid_scan = true;

        valid_language = true;

        valid_genre = true;

        if(!language){
            req.language = "pt";
        }

        if(title && genre && synopsis && chapters && status && scan){  
            
            console.log(typeof(title))
            console.log(typeof(title) !== 'string')
            
            if(typeof(title) !== 'string')
                return res.jsonBadRequest(null, "title must be a string.", null);
            
            else if(typeof(genre) !== 'string')
                return res.jsonBadRequest(null, "genre must be a string.", null); 

            else if(typeof(synopsis) !== 'string')
                return res.jsonBadRequest(null, "synopsis must be a string.", null);  
                
            else if(typeof(chapters) !== 'number')
                return res.jsonBadRequest(null, "chapters must be a number.", null); 
                
            else if(typeof(scan) !== 'string')
                return res.jsonBadRequest(null, "scan must be a string.", null); 

            else if(typeof(status) !== 'number')
                return res.jsonBadRequest(null, "status must be a number.", null);
                
            else if(typeof(language) !== 'string')
                return res.jsonBadRequest(null, "language must be a string.", null);
                
            else {
                if (status < 1 || status > 6){
                    return res.jsonBadRequest(null, "invalid status code.", null);
                }

                else if(title.length < 10 || title.length >= 60) 
                    return res.jsonBadRequest(null, "title must be between 10-60 characters.", null);
                
                else if(synopsis.length < 10 || synopsis.length >= 400) 
                    return res.jsonBadRequest(null, "synopsis must be between 10-400 characters.", null);

                else if(!valid_scan) 
                    return res.jsonBadRequest(null, "unregistered scan", null);

                else if(!valid_language) 
                    return res.jsonBadRequest(null, "invalid language", null);
                
                else if(!valid_genre) 
                    return res.jsonBadRequest(null, "invalid genre", null);

                next(); 

            }                
        }  
        else
             return res.jsonBadRequest(null, "some required fields are missing.", null)          
                        
    }  
}