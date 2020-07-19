import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Reader from './pages/Reader'
import HorizontalMenu from './Components/Menu/Horizontal'

export default function Routes(){
    return (
       <div className='routes-container'>
        
        <BrowserRouter>
            <Switch>
                <Route path="/reader" exact component ={Reader}/>
            </Switch>
          
        <HorizontalMenu/>
        </BrowserRouter>
       </div>
       
    );
}