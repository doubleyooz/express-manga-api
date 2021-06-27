import * as yup from 'yup'

const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string()
        .min(8, "Password is too short.")
        .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                "Invalid password")
        .required(),  
});

export default userSchema