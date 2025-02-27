import React, { createContext, useState, useContext } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext();

// Fornece o contexto para os componentes filhos
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    setUser(userData); // Define os dados do usuário
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null); // Limpa os dados do usuário ao sair
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
  