import React, { useState, useEffect, useContext } from 'react';
import './styles.css';

import api from "../../services/api"

import { Context } from '../../Contexts/AuthProvider'

export default function Home(){
    const { token, loading, handleLogin } = useContext(Context)

    const [text, setText] = useState("");  

    useEffect(()=>{
        async function fetchData(){
            handleLogin()
            if(!loading){
                console.log(token)
                if(token !== ""){
                    setText(`login well succeed: ${token}`)
                } else{
                    setText("login failed")
                }                
            }                            
        }        
        fetchData()     
            
    }, []) // <-- empty dependency array




    return(
        <>  
            <div className="home-container">
                <h1>{text}</h1>
            </div>
            
        </>
    )
}