import React, { createContext, useState, useEffect } from 'react';

import useAuth from './hooks/useAuth';

const Context = createContext();

const [auth, setAuth] = useState(""); 

function AuthProvider({ children }) {
  const {
    authenticated, loading, handleLogin, handleLogout,
  } = useAuth();

  return (
    <Context.Provider value={{ authenticated}}>
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };