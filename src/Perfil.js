import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from './auth';

const Perfil = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <div>
      <h1 id="titulo">Bem-vindo ao seu perfil!</h1>
      <button onClick={handleLogout}>Logout</button>
      <br/>
      <Link to="/RAC">RAC</Link><br/>
      <Link to="/">home</Link>

    </div>
  );
};

export default Perfil;
