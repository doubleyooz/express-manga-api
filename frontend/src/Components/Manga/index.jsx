import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';


import { Context } from '../../Contexts/AuthProvider'
import './styles.scss';

export default function Manga(props){    

    const { token, setToken, handleLogin } = useContext(Context)
    let history = useHistory();
   
    
    return (
      
        
        <div className="manga-container">
            <img src={process.env.REACT_APP_SERVER + "/" + props.data.title + "/" + props.data.cover}
                    alt= {props.data.title}                   
                    onClick={() => history.push(`/manga/${props.data.title}`)}                     
                />

            <div className="manga-info">
                
                <Link to={{ pathname: `/Manga/${props.data.title.replace(" ", "%20")}`, state: props.data.manga }}>                    
                    {props.data.title}

                </Link>
                

                
            </div>
               
            
        </div>
    )
       
           
        
};