import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import Headers from './Components/Headers.js';

const Perfil = () => {
  const { logout } = useAuth(); // Obtendo o usuário do contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/autenticacao"); 
  };

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Nova Rac', url: '/novarac' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Home', url: '/' },
    { label: 'Importar Planilha', url: '/importarplanilha' }
  ];

  return (
    <div>
      <Headers links={links} handleLogout={handleLogout} />
      <h1 id="titulo">Bem-vindo!</h1>
    </div>
  );
};

export default Perfil;