import React, {useState, useEffect, useContext} from 'react';

import {AuthProvider} from './Contexts/AuthProvider'
import Routes from "./routes";

import api from "./services/api"
import GlobalStyle from './styles/global';

function App() {
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api.get("refresh-token").then(x => {
      const { accessToken } = x.data.accessToken;
      //setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

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
