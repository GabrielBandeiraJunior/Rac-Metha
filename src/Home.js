import React from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom'; // Certifique-se de importar useNavigate
import { useAuth } from './auth'; // Certifique-se de que useAuth está importado
import Headers from './Components/Headers.js';

export default function Home() {
  const { logout, isAuthenticated } = useAuth(); // Obtenha logout e isAuthenticated do contexto
  const navigate = useNavigate();

  const links = [
    { label: 'Perfil', url: '/Perfil' },
    { label: 'Autenticacao', url: '/Autenticacao' }
  ];

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
    navigate("/Autenticacao");
  };

  return (
    <>
      <div id="tudo">
        <Headers links={links} handleLogout={handleLogout} />
        <h1>Home</h1>
        <Link to="/rac" className="styled-button">Registrar Nova Rac</Link> <br/><br/>
        <Link to="/racscadastradas" className="styled-button">Consultar Racs Cadastradas</Link>
        
      </div>
    </>
  );
}
