import React from 'react';

import api from "../../services/api"

import './styles.css';

async function redirect() {
   
    const response = await api.get("/authentication/activate/");
    
    console.log(response.data);
}

redirect()
export default function ActivateAccount(){
    return(
        <>  
            <div className="redirecting-container">
                <h1>Redirecting</h1>
            </div>
            
        </>
    )
}