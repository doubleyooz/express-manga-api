import React, { useState, useEffect } from 'react';
import './styles.css';

const api = require("../../services/api")

export default function Home(){
    
    const [text, setText] = useState("");  

    useEffect(()=>{
        let config = {
            
            auth: {
                username: "itachiut1r4@gmail.com",
                password: "Lucarneiro@0009"
            }
            
        }

       

        api.get_instance().get('sign-in', config).then(response =>{
            console.log(response.data)
            setText("login well succeed")
            console.log(text)
        }).catch(err=>{
            console.log(err)            
            setText("login failed")
            console.log(text)
        })
    }, []) // <-- empty dependency array




    return(
        <>  
            <div className="home-container">
                <h1>{text}</h1>
            </div>
            
        </>
    )
}