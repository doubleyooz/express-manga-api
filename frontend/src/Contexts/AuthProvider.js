import React, { createContext, useState, useEffect } from 'react';

//import useAuth from './hooks/useAuth';
import api from "../services/api"

const Context = createContext();



function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null); 

    async function handleLogin(){
        let config = {
            
            auth: {
                username: "itachiut1r4@gmail.com",
                password: "Lucarneiro@0009"
            }
            
        }        

        api.get('sign-in', config).then(response =>{
            
            setAuth(response.data.metadata.token.toString())
            
           
            return true
            
        }).catch(err=>{
            console.log(err)            
            setAuth(null)
            return false
        })
    }

   /* const {
    authenticated, loading, handleLogin, handleLogout,
    } = useAuth();*/

    return (
    <Context.Provider value={{ auth, handleLogin }}>
        {children}
    </Context.Provider>
    );
}

export { Context, AuthProvider };