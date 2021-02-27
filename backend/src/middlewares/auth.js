const jwt = require('../common/jwt');
const response = require('../common/response');
const User = require("../models/user");

module.exports = {
  
    async auth(req, res, next){
        try{
            const [, token] = req.headers.authorization.split(" ")
            
            try{
                const payload = await jwt.verifyJwt(token);
                console.log(payload)
                const user = await User.findById(payload.id)
                if(await User.exists({_id: payload.id} )){
                    next();
                }
                else{ 
                    return res.json( 
                        response.jsonUnauthorized(null, response.getMessage("Unauthorized"), null)
                    )
                }

            } catch(err){
                return res.json(
                    response.jsonUnauthorized(null, response.getMessage("Unauthorized"), err.errors)
                )
            }
        } catch(err){
            return res.json(
                response.jsonUnauthorized(null, response.getMessage("Unauthorized"), err.errors)
            )
        }
       

    },

}