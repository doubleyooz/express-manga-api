import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';


import { Context } from '../../Contexts/AuthProvider'
import './styles.scss';

export default function Chapter(props){    

    const { token, setToken, handleLogin } = useContext(Context)
    let history = useHistory();
   
    
    return (
      
        
        <div className="chapter-container">
           
            <div className="row">
                <div className="title">{props.data.title}</div>
                <div className="number">{props.data.number}</div>
             
               
                
            </div>
           
               
            
        </div>
    )
       
           
        
};