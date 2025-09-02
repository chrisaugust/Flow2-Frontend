import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt') || null);

  const login = (token) => {
    localStorage.setItem('jwt', token);
    setJwt(token);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
  };

  return (
    <AuthContext.Provider value={{ jwt, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
