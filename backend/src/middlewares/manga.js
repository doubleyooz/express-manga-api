
import { Request, Response, NextFunction } from 'express';

import { IUser } from '../models/user';
import response from '../common/response';


module.exports = {
    valid_user(req, res, next){         
                       
        const { title, genre, synopsis, chapters, status, scan, language } = req.body;      

        if(title && genre && synopsis && chapters && status && scan && language){     
            
            let emailTest = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            let passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
            
            
            if (email.match(emailTest) && password.match(passwordTest))                                                     
                next();                                                     
            
            else{

                return res.json(        
                    response.jsonBadRequest(null, "Password or email invalid.", null)              
                );    
            }             
        }  
        else
            return res.json(        
                response.jsonBadRequest(null, "Password or email is missing.", null)              
            );             

        
    }  
}