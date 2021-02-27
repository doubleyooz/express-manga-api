const yup = require("yup");
const response = require("../common/response");




const rules = {
    email:  yup.string().email().required(),
    password: yup.string()
                .min(8, response.getMessage("user.invalid.password.short"))
                .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                        response.getMessage("user.invalid.password.weak"))
                .required(),
    sign_in_password: yup.string()
                .min(8, response.getMessage("user.invalid.password.short"))
                .required()
}

module.exports = {
    async valid_sign_up(req, res, next){       
                       
               
        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.password,
        });

        yupObject.validate(req.body).then(() => next())
                 .catch((err) => {
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("badRequest"), err.errors)              
                    )  
                })

       
    },
    
    async valid_sign_in(req, res, next){    
                       
               
        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.sign_in_password,
        });

        yupObject.validate(req.body).then(() => next())
                 .catch((err) => {
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("badRequest"), err.errors)              
                    )  
                })

       
    },
   
}