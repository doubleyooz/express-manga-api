import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

const Login = async googleData => {
    const { token, loading, handleLogin } = useContext(Context)
   
      

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

    
 
   
    return <>   
        <div className="login">
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={'single_host_origin'}
        />

        </div>
      
        

    </>
}

export default Login

