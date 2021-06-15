import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { NavBtn, Logo, HorizontalNavBar, Options } from './styles.js';



export default function Menu(){
    const [currentNav, setCurrentNav] = useState("");  
   
   

    return (
        
        <HorizontalNavBar className="horizontal_navbar">           
            <Options>
                <Link to='/'>
                    <Logo/>            
                </Link> 

                <Link to='/' >
                    <NavBtn isActive={currentNav === "a"} onClick={() => setCurrentNav('a')}>
                        HOME
                    </NavBtn>
                </Link> 

                <Link to='/search'>
                    <NavBtn isActive={currentNav === "b"} onClick={() => setCurrentNav('b')}>
                      SEARCH
                    </NavBtn>                       
                </Link> 

                
               
            </Options>           
           
        </HorizontalNavBar>       
       
        
    )
};