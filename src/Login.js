import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import './Autenticacao.css';
const API_URL = process.env.REACT_APP_API_URL;
function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Iniciando processo de login...'); // Log inicial

    try {
      console.log('Chamando função login do auth context...');
      const success = await login(usuario, senha);
      
      if (success) {
        console.log('Login bem-sucedido, redirecionando para /perfil');
        navigate('/perfil');
      } else {
        console.warn('Credenciais inválidas');
        setError('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error("Erro completo no login:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      console.log('Processo de login finalizado');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => {
            console.log('Usuário alterado:', e.target.value);
            setUsuario(e.target.value);
          }}
          required
          className="auth-input"
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => {
            console.log('Senha alterada (valor oculto no log por segurança)');
            setSenha(e.target.value);
          }}
          required
          className="auth-input"
        />
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      {/* <div className="auth-links">
        <button 
          onClick={() => {
            console.log('Navegando para página de registro');
            navigate('/register');
          }}
          className="auth-link-button"
        >
          Criar nova conta
        </button>
      </div> */}
    </div>
  );
}

export default Login;