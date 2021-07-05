import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';


import { Context } from '../../Contexts/AuthProvider'
import './styles.scss';

export default function Chapter(props){    

    const { token, setToken, handleLogin } = useContext(Context)
    let history = useHistory();
   
    console.log(props)
    return (
      
       
        <div className="chapter-container">
           
            <div className="row">
              
             
                <Link to={{ pathname: `/Manga/${props.data.manga.title.replace(" ", "%20")}/${props.data.number}`, 
                                    state: {chapter:  props.data.chapter, chapters: props.data.manga.chapters}}}> 
                    <div className="title">{props.data.title}</div>
                    <div className="number">Chapter {props.data.number}</div>                   
                                  
                                
                </Link>
                 <h4>Scan_name</h4>
            </div>
           
               
            
        </div>
    )
       
           
        
};