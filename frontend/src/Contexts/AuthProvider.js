import React, { createContext, useState, useEffect } from 'react';

//import useAuth from './hooks/useAuth';
import api from "../services/api"

const Context = createContext();



function AuthProvider({ children }) {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true) 

    async function handleLogin(){
        let config = {
            
            auth: {
                username: "itachiut1r4@gmail.com",
                password: "Lucarneiro@0009"
            }
            
        }        

        api.get('sign-in', config).then(response =>{
            
            setToken(response.data.metadata.token.toString())
            console.log("sign-in well succeed")
           
            setLoading(false)
            
        }).catch(err=>{
            console.log(err)
            console.log("sign-error")         
            setToken("")
            setLoading(false)
        })
    }

   /* const {
    authenticated, loading, handleLogin, handleLogout,
    } = useAuth();*/

    return (
    <Context.Provider value={{ token, setToken, loading, handleLogin }}>
        {children}
    </Context.Provider>
    );
}

export { Context, AuthProvider };