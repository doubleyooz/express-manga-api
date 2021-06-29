import React, {useState, useEffect, useContext} from 'react';

import {AuthProvider} from './Contexts/AuthProvider'
import Routes from "./routes";

import api from "./services/api"

import './styles/global.scss';

function App() {
 
  return (
    <>
      <div className="body">
        <AuthProvider>
          <Routes />
         
        </AuthProvider>
        
      </div>
    </>
  );
}

export default App;
