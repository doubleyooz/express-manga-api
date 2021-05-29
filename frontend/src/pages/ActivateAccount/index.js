import React, { useState } from 'react';

import api from "../../services/api"

import './styles.css';

import { useParams } from "react-router-dom";



export default function ActivateAccount(){   

    const [response, setResponse] = useState("");  
    let { token } = useParams();   

    async function activate(){
        api.post(`/authentication/activate/${token}`).then(res =>{            
            setResponse(res.data.message)          
        }).catch(err=>{
            setResponse(err.message)            
            
        })
    }
    activate()
    
    return(
        <>  
            <div className="redirecting-container">
                <h1>Redirecting</h1>
                <div>{response}</div>;
               
            </div>
            
        </>
    )
}