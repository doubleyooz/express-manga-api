import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { GoogleLogin } from 'react-google-login';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import  userSchema from '../../Validations/LoginValidation'
import api from "../../services/api"

require('dotenv').config()

const Login = () =>{
    //const { token, loading } = useContext(Context)
    
    const { register, handleSubmit,  formState: { errors } } = useForm({
        // defaultValues: { firstName: data.firstName, lastName: data.lastName },
        mode: "onBlur",
        resolver: yupResolver(userSchema),
    });


    const onSubmit = data => console.log(data);
  
      
    /*const login = async (event) =>{
        event.preventDefault()
        let formData ={
            email: event.target[0].value,
            password: event.target[1].value
        }

        userSchema.validate(formData).then(() => {
            
        })
            .catch((err) => {
                      
            
        })
    }*/

    const handleLogin = async googleData => {
        const res = await fetch("/api/v1/auth/google", {
            method: "POST",
            body: JSON.stringify({
            token: googleData.tokenId
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        // store returned user somehow
    }
   
    
 
   
    return <>   
        <div className="login-page">

            <div className="card">

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">

                        {/* register your input into the hook by invoking the "register" function */}
                        <input placeholder="email"  {...register("email")} error={!!errors.email} />
                        <span>{errors.email?.message}</span>
                    </div>

                    <div className="field">
                        {/* include validation with required or other standard HTML validation rules */}
                        <input type="password" placeholder="password" {...register("password")} error={!!errors.password} />
                        <span>{errors.password?.message}</span>
                        
                    </div>                   

                
                    
                    <input type="submit" />
                </form>


                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Log in with Google"
                    onSuccess={handleLogin}
                    onFailure={handleLogin}
                    cookiePolicy={'single_host_origin'}
                />

                <div className="help">
                    <span>Forgot password?</span>
                    <span>create account</span>
                </div>
            </div>


        </div>
      
        

    </>
}

export default Login

