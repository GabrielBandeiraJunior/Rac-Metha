import React, { useState } from 'react';
import axios from 'axios';
import Headers from './Components/Headers';

const ImportExcelClientes = () => {
  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [dadosPreview, setDadosPreview] = useState([]);

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handlePreview = async () => {
    if (!arquivo) return;

    const formData = new FormData();
    formData.append('planilha', arquivo);

    try {
      setCarregando(true);
      const response = await axios.post('http://localhost:3000/api/importar/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDadosPreview(response.data);
      setMensagem(`Pré-visualização carregada: ${response.data.length} registros encontrados`);
    } catch (error) {
      setMensagem('Erro ao carregar pré-visualização: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleImportar = async () => {
    if (!arquivo || dadosPreview.length === 0) return;

    try {
      setCarregando(true);
      const formData = new FormData();
      formData.append('planilha', arquivo);

      const response = await axios.post('http://localhost:3000/api/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMensagem(`Importação concluída: ${response.data.registrosInseridos} registros importados com sucesso!`);
      setDadosPreview([]);
    } catch (error) {
      setMensagem('Erro durante a importação: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Cadastrar RAC', url: '/novarac' },
    { label: 'Importar Planilha', url: '/importarplanilha' },
    { label: 'Home', url: '/' },
  ];

  return (
    <div className="container">
      <Headers links={links} />
      <h2>Importar Dados dos Clientes</h2>
      
      <div className="mb-3">
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileChange} 
          className="form-control"
        />
      </div>
      
      <div className="mb-3">
        <button 
          onClick={handlePreview} 
          disabled={!arquivo || carregando}
          className="btn btn-primary me-2"
        >
          {carregando ? 'Carregando...' : 'Pré-visualizar'}
        </button>
        
        <button 
          onClick={handleImportar} 
          disabled={dadosPreview.length === 0 || carregando}
          className="btn btn-success"
        >
          {carregando ? 'Importando...' : 'Importar Dados'}
        </button>
      </div>
      
      {mensagem && <div className="alert alert-info">{mensagem}</div>}
      
      {dadosPreview.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome/Razão Social</th>
                <th>Fantasia</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>UF</th>

              </tr>
            </thead>
            <tbody>
              {dadosPreview.slice(0, 5000).map((empresa, index) => (
                <tr key={index}>
                  <td>{empresa.cnpj || '-'}</td>
                  <td>{empresa.Nome || '-'}</td>
                  <td>{empresa.Fantasia || '-'}</td>
                  <td>{empresa.Fone|| '-'}</td>
                  <td>{empresa.Contato || '-'}</td>
                  <td>{empresa.CNPJ || '-'}</td>
                  <td>{empresa.uf || '-'}</td>
                  <td>{empresa.Cidade || '-'}</td>
                  <td>{empresa.Bairro || '-'}</td>
                  <td>{empresa.Endereço || '-'}</td>
                  <td>{empresa.Cep || '-'}</td>
                  <td>{empresa.Vendedor || '-'}</td>
                  <td>{empresa.Gerente || '-'}</td>
                  <td>{empresa.Grupo || '-'}</td>
                  {/* <td>{empresa.Fone 2 || '-'}</td> */}
                  <td>{empresa.Email || '-'}</td>
                  {/* <td>{empresa.Inscr. Estadual || '-'}</td> */}
                  <td>{empresa.Grupo || '-'}</td>
                  <td>{empresa.Tabela || '-'}</td>
                  <td>{empresa.Banco || '-'}</td>
                  <td>{empresa.FormaPag || '-'}</td>
                  {/* <td>{empresa.Data Cad || '-'}</td>
                  <td>{empresa.Obs. || '-'}</td> */}
                  

                </tr>
              ))}
              {dadosPreview.length > 5 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    + {dadosPreview.length - 5} registros não exibidos...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImportExcelClientes;