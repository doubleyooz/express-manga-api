import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';


import { Context } from '../../../Contexts/AuthProvider'
import './styles.css';

export default function Menu(){
    const [showOptions, setShowOptions] = useState(false);  

    const { token, setToken, handleLogin } = useContext(Context)

   
    return (
        <ul className="horizontal-navbar">
            
            
                       

            <Link to='/'> 
                <li className="nav-button">

                </li>         
            </Link> 

            <Link to='/'>
                <li className="nav-button">

                </li>         
            </Link> 
            <div className="menu">
                <button className="profile" onClick={() => setShowOptions(!showOptions)}>
                    
                </button>
        
                    {token?                     
                        <ul className={showOptions ? "options-display" : "options"}>
                            <Link to='/user'> 
                                <li>Profile</li>        
                            </Link>                        
                            <li>Config</li>                        
                            <Link to='/'> 
                                <li onClick={() => setToken(undefined)}>Logout</li>        
                            </Link> 
                            
                        </ul>
                        :
                        
                        <ul className={showOptions ? "options-display" : "options"}>
                            <Link to='/Login'> 
                                <li>Login</li>        
                            </Link>                      
                                            
                            <Link to='/'> 
                                <li>Create account</li>        
                            </Link> 
                            
                        </ul>
                         
                    }    
            </div>
           
            
            
        </ul>
               
    )
};