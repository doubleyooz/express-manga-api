import * as yup from 'yup'



const rules = {
        email:  yup.string().email().required(),
        password: yup.string()
                    .min(8, "Password is too short.")
                    .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                        "Invalid password")
                    .required(),        
    }
    

export const userSchema = yup.object().shape({
    email: rules.email,
    password: rules.password
});

export const passwordSchema = yup.object().shape({        
        password: rules.password 
});