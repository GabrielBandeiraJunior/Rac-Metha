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
      
      <br/>
      <Link to="/RAC">Cadastrar nova RAC</Link><br/>
      <Link to="/">Voltar para Login/Regitro</Link><br/>
      <Link to="/RacsCadastradas">Racs Cadastradas</Link><br/>
      <br/>
      <br/>
        <button onClick={handleLogout}>Logout</button>

    </div>
  );
};

export default Perfil;
