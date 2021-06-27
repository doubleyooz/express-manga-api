import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import * as yup from 'yup'

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import { useSchema } from '../../Validations/LoginValidation'
import api from "../../services/api"

require('dotenv').config()

const Login = () =>{
    const { token, loading } = useContext(Context)
   
      
    const login = (event) =>{
        event.preventDefault()
        let formData ={
            email: event.target[0].value,
            password: event.target[1].value
        }
    }

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
                <form className="form" onSubmit={login}>
                    <div className="field">
                        <span>Email</span>
                        <input type="text" placeholder="Email" />
                    </div>

                    <div className="field">
                        <span>Password</span>
                        <input type="text" placeholder="Senha" />
                    </div>
                    <input type="submit" value="Login"/>


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

