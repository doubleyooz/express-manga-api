const yup = require("yup");
const { getMessage } = require("../common/messages");





const rules = {
    email:  yup.string().email().required(),
    password: yup.string()
                .min(8, getMessage("user.invalid.password.short"))
                .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                        getMessage("user.invalid.password.weak"))
                .required(),
    name: yup.string()
                .min(3, getMessage("user.invalid.name.short"))               
                .required(),
    role: yup.string()
                .matches(/(Scan|User)/, null),
    sign_in_password: yup.string()
                .min(8, getMessage("user.invalid.password.short"))
                .required()
}

const credentials = {
   
}

module.exports = {

    async valid_google_sign_up(req, res, next){
        const { token }  = req.body;

        let payload = null;

        try{
            payload = jwt.verifyJwt(token, 3)
            

        }catch(err){
            console.log(err)
            return res.jsonUnauthorized(null, null, null)
            
        }

        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.password,
            name: rules.name,
            role: rules.role
        });

        yupObject.validate(req.body).then(() => next())
                    .catch((err) => {
                    return res.jsonBadRequest(null, null, err.errors)              
                    
                })
        

    },

    async valid_sign_up(req, res, next){                                   
               
        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.password,
            name: rules.name,
            role: rules.role
        });

        yupObject.validate(req.body).then(() => next())
                 .catch((err) => {
                    return res.jsonBadRequest(null, null, err.errors)              
                    
                })
       
    },
    
    async valid_sign_in(req, res, next){
        
        const [hashType, hash] = req.headers.authorization.split(' ');
       
        if(hashType !== "Basic"){
            return res.jsonUnauthorized(null, null, null)              
            
        }
    
        const [email, password] = Buffer.from(hash, "base64").toString().split(":");
                       
        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.sign_in_password,
        });

        yupObject.validate({email: email, password: password}).then(() => next())
                 .catch((err) => {
                    return res.jsonBadRequest(null, null, err.errors)              
                    
                })
       
    },

    async valid_user_delete(req, res, next){
        const { user_id } = req.query;
        if(user_id){
            let req_id = require("crypto-js").AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))

            if (req_id === user_id){
                next();
            }
            req.auth = null;
            return res.jsonBadRequest(null, null, err.errors)
        }

        return res.jsonBadRequest(null, null, err.errors)
        
    }   
}