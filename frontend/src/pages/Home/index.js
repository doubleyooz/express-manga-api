import React, { useState, useEffect, useContext } from 'react';
import './styles.css';

import api from "../../services/api"

import { Context } from '../../Contexts/AuthProvider'

export default function Home(){
    const { auth, handleLogin } = useContext(Context)

    const [text, setText] = useState("");  

    useEffect(()=>{
        async function fetchData(){
            if(await handleLogin()){
                console.log(auth)
                setText(`login well succeed: ${auth}`)
            }
            else{
                setText("login failed")
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