import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Reader from './pages/Reader'
import ActivateAccount from './pages/ActivateAccount'
import Home from './pages/Home'
import Manga from './pages/Manga'
import Search from './pages/Search'
import Login from './pages/Login'

import HorizontalMenu from './Components/Menu/Horizontal'

export default function Routes(){
    return (
       <div className='routes-container'>
        
            <BrowserRouter>
                
                <Switch>
                    <Route path="/manga/:manga_title" exact component ={Manga}/>
                    <Route path="/manga/:manga_title/:chapter_number" exact component ={Reader}/>
                    <Route path="/" exact component ={Home}/>
                    <Route path="/activateaccount/:token" exact component ={ActivateAccount}/>
                    <Route path="/search" exact component ={Search}/>
                    <Route path="/login" exact component ={Login}/>


                </Switch>
            
                <HorizontalMenu/>
            </BrowserRouter>
       </div>
       
    );
}