import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Reader from './pages/Reader'
import ActivateAccount from './pages/ActivateAccount'
import Home from './pages/Home'
import Manga from './pages/Manga'

import HorizontalMenu from './Components/Menu/Horizontal'

export default function Routes(){
    return (
       <div className='routes-container'>
        
        <BrowserRouter>
            
            <Switch>
                <Route path="/manga" exact component ={Manga}/>
                <Route path="/reader" exact component ={Reader}/>
                <Route path="/" exact component ={Home}/>
                <Route path="/activateaccount/:token" exact component ={ActivateAccount}/>
            </Switch>
          
            <HorizontalMenu/>
        </BrowserRouter>
       </div>
       
    );
}