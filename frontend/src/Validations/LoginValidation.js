import * as yup from 'yup'

const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string()
        .min(8, "Password is too short -it must be at least 8 characters long.")
        .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                "the password must contain at least 1 number, at least 1 lower case letter, at least 1 upper case and at least 1 special character.")
        .required(),  
});

export default userSchema