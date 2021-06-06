import React from "react";

import {AuthProvider} from './Contexts/AuthProvider'
import Routes from "./routes";


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
