// src/Components/Headers.js
import { useAuth } from '../auth';
import './Headers.css'

const Headers = ({ links }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    // Opcional: redirecionar para a página de login
    window.location.href = '/autenticacao';
  };

  return (
    <header>
      <nav>
        <ul>
        
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.url}>{link.label}</a>
            </li>
          ))}
          {user && (
            <li>
              
              <button onClick={handleLogout}>Logout</button>
              <h2>{user.nome}</h2>  
            </li>
            
          )}
        </ul>
      </nav>
    </header>
    
  );
};

export default Headers;