import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = async (usuario, senha) => {
    try {
      console.log('Iniciando processo de login para:', usuario);
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Credenciais inválidas');
      }

      console.log('Armazenando token e dados do usuário...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Atualiza o estado global do usuário
      setUser(data.user);

      console.log('Login concluído com sucesso');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  // Função de registro
  const register = async (usuario, senha, nome) => {
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha, nome }),
      });

      if (!response.ok) {
        throw new Error('Erro no registro');
      }

      return await login(usuario, senha);
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  // Função de logout
  // Na função logout do auth.js
const logout = () => {
  console.log('Iniciando logout...');
  console.log('Antes de limpar:', { 
    token: localStorage.getItem('token'), 
    user: localStorage.getItem('user') 
  });
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  console.log('Depois de limpar:', { 
    token: localStorage.getItem('token'), 
    user: localStorage.getItem('user') 
  });
  
  setUser(null);
  console.log('Estado do usuário definido como null');
};

  // Adicionando a variável isAuthenticated
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto em outros componentes
export const useAuth = () => useContext(AuthContext);
