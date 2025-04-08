// src/perfil.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import Headers from './Components/Headers';
import RacsCadastradas from './RacsCadastradas';
import RacForm from './RACForm';

const Perfil = () => {
  const { user, logout } = useAuth(); // Adicionamos logout aqui
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/autenticacao'); // Redireciona para autenticação se não houver usuário
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout(); // Chama a função de logout
    navigate('/autenticacao'); // Redireciona para a página de autenticação
  };

  if (!user) return null;

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Cadastrar RAC', url: '/novarac' },
    { label: 'Importar Planilha', url: '/importarplanilha' },
    { label: 'Home', url: '/' },
  ]

  return (
    <div>
      <Headers links={links} />
      
      <h1>Bem-vindo, {user.nome} !</h1>
      
      
      {/* <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Perfil;