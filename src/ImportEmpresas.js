// components/ImportEmpresas.js
import React, { useState } from 'react';
import axios from 'axios';
import Headers from './Components/Headers.js';
import { Link, useNavigate } from 'react-router-dom'; // Certifique-se de importar useNavigate
import { useAuth } from './auth'; // Certifique-se de que useAuth está importado
import EmpresasManager from './EmpresasManager.js';

const ImportEmpresas = () => {
  const { logout, isAuthenticated } = useAuth(); // Obtenha logout e isAuthenticated do contexto
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapping, setMapping] = useState({
    'Codigo': 'Codigo',
    'Nome': 'Nome',
    'Fantasia': 'Fantasia',
    'Fone': 'Fone',
    'Contato': 'Contato',
    'InscricaoEstadual': 'InscricaoEstadual',
    'UF': 'UF',
    'Cidade': 'Cidade',
    'Bairro': 'Bairro',
    'Endereço': 'Endereço',
    'Cep': 'Cep',
    'Vendedor': 'Vendedor',
    'Gerente': 'Gerente',
    'Grupo': 'Grupo',
    'Tabela': 'Tabela',
    'Banco': 'Banco',
    'FormaPag': 'FormaPag',
    'Data Cad': 'Data Cad',
    'Fone 2': 'Fone 2',
    'Email': 'Email',
    'CNPJ': 'CNPJ'
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMappingChange = (e, column) => {
    setMapping({
      ...mapping,
      [column]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    setMessage('Por favor, selecione um arquivo');
    return;
  }

  setIsLoading(true);
  setMessage('');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('mapping', JSON.stringify(mapping));

  try {
    // Adicione a URL base correta aqui
    const response = await axios.post('https://process.env.REACT_APP_API_URL/empresas/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setMessage(response.data.message || 'Importação realizada com sucesso!');
  } catch (error) {
    setMessage(`Erro na importação: ${error.response?.data?.message || error.message}`);
    console.error('Detalhes do erro:', error); // Adicione para debug
  } finally {
    setIsLoading(false);
  }
};

const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Cadastrar RAC', url: '/novarac' },
    { label: 'Importar Planilha', url: '/importarplanilha' },
    { label: 'Home', url: '/' },
    { label: 'Importar Empresas', url: '/ImportEmpresas' },
  ]
  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
    navigate("/Autenticacao");
  };

  return (
    
    <div className="container mt-4">

    <Headers links={links} handleLogout={handleLogout} />

      <h2>Importar Empresas</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Arquivo Excel</label>
          <input 
            type="file" 
            className="form-control" 
            id="file" 
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Importando...' : 'Importar'}
        </button>
        </div>

        

        <EmpresasManager/>

        
      </form>

      {message && (
        <div className={`alert ${message.includes('Erro') ? 'alert-danger' : 'alert-success'} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ImportEmpresas;