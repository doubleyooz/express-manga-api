import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';


import { Context } from '../../Contexts/AuthProvider'
import './styles.scss';

export default function Activity(props){    

    const { token, setToken, handleLogin } = useContext(Context)
    let history = useHistory();
    
        
    return (
      
        
        <div className="manga-container">
            <img src={process.env.REACT_APP_SERVER + "/" + props.data.title + "/" + props.data.cover}
                    alt= {props.data.title}                   
                    onClick={() => history.push(`/manga/${props.data.title}`)}                     
                />

            <div className="manga-info">
                <div 
                    className="manga-title"
                    onClick={() => 
                        history.push(
                            `/Manga/${props.data.title.replace(" ", "%20")}/`, 
                            {state: props.data}
                        )}
                    style={props.data.title.length > 22 ? {fontSize: '13px'} : {fontSize: '16px'}}
                >
                    {props.data.title}
                </div>

                <div className="chapters">
                    {props.data.chapters.length !== 0 ? props.data.chapters.map((chapter) => (
                      
                        
                        <div 
                            className="manga-chapter"
                            onClick={() => 
                                history.push(
                                    `/Manga/${props.data.title.replace(" ", "%20")}/${chapter.number}` 
                                    
                                )}
                        >
                        {chapter.number}
                        </div>
                       
                                              
                        
                    )): <div>no manga to be shown</div>}
                 
                </div>
                
                <div className="scan">
                    
                </div>

                
            </div>
            <div className="updated">
                28 seconds ago
            </div>
            
        </div>
    )
       
           
        
};