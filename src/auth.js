  import React, { createContext, useState, useContext } from 'react';

  // Cria o contexto de autenticação
  const AuthContext = createContext();

  // Fornece o contexto para os componentes filhos
  export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

    const login = (token) => {
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
    }

    const logout = () => {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }

    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  // Hook personalizado para acessar o contexto de autenticação
  export const useAuth = () => useContext(AuthContext);
