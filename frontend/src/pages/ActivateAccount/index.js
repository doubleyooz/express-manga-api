import React, { useState, useEffect } from 'react';

import api from "../../services/api"

import './styles.css';

import { useParams } from "react-router-dom";



export default function ActivateAccount(){   
    const [response, setResponse] = useState(""); 
    useEffect(() => {
        // Update the document title using the browser API
        api.post(`/authentication/activate/${token}`).then(res =>{            
            setResponse(res.data.message)          
        }).catch(err=>{
            setResponse(err.message)            
            
        })
      }, []);
   

    let { token } = useParams();   

    return(
        <>  
            <div className="redirecting-container">
                <h1>Redirecting</h1>
                <div>{response}</div>;
               
            </div>
            
        </>
    )
}