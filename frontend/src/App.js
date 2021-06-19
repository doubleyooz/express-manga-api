import React, {useState, useEffect, useContext} from 'react';

import {AuthProvider} from './Contexts/AuthProvider'
import Routes from "./routes";

import api from "./services/api"
import GlobalStyle from './styles/global';

function App() {
 
  return (
    <>
      <div className="body">
        <AuthProvider>
          <Routes />
          <GlobalStyle/>
        </AuthProvider>
        
      </div>
    </>
  );
}

export default App;
