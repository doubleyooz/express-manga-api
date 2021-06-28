import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import './styles.css';

export default function Menu(){
    const [currentNav, setCurrentNav] = useState("");  
   
   
    return (
        <ul className="horizontal-navbar">
            
                <Link to='/'>
                    <button className="profile">
                        <ul className="options">

                        </ul>
                    </button>         
                </Link> 

                <Link to='/'> 
                    <li className="nav-button" style={currentNav === "a" ? {backgroundColor: "#41357E"}  : {backgroundColor: ""}}onClick={() => setCurrentNav('a')}>

                    </li>         
                </Link> 

                <Link to='/'>
                    <li className="nav-button">

                    </li>         
                </Link> 
               
            
        </ul>
               
    )
};