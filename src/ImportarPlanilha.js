import React, { useState } from 'react';
import axios from 'axios';
import Headers from './Components/Headers';
// import './ImportarPlanilha.css'; // Você pode criar este CSS para estilização

export default function ImportarPlanilha() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para enviar o arquivo da planilha para o backend
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus('Por favor, selecione um arquivo antes de enviar.');
      return;
    }

    if (!file.name.endsWith('.xlsx')) {
      setUploadStatus('Por favor, selecione um arquivo .xlsx');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setIsLoading(true);
    setUploadStatus('Enviando arquivo...');

    try {
      const response = await axios.post('https://process.env.REACT_APP_API_URL:3000/racvirtual/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Dados da planilha importados:', response.data);
      setUploadStatus('Planilha importada com sucesso!');
      setFile(null);
    } catch (error) {
      console.error('Erro ao importar planilha:', error);
      setUploadStatus(`Erro ao importar planilha: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadStatus('');
  };

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Cadastrar RAC', url: '/novarac' },
    { label: 'Importar Planilha', url: '/importarplanilha' },
    { label: 'Home', url: '/' },
  ];

  // Modelo de planilha com os campos necessários
  const camposPlanilha = [
    { grupo: "Informações da Empresa", campos: [
      "razaoSocial", "cnpj", "endereco", "numero", "cidade", "responsavel", "setor"
    ]},
    { grupo: "Datas e Horários", campos: [
      "dataInicio", "horaInicio", "dataTermino", "horaTermino",
      "horaIntervaloInicio", "horaIntervaloTermino",
      "horaIntervaloInicio2", "horaIntervaloTermino2"
    ]},
    { grupo: "Serviços Prestados", campos: [
      "instalacaoDeEquipamentos", "manutencaoDeEquipamentos", "homologacaoDeInfra",
      "treinamentoOperacional", "implantacaoDeSistemas", "manutencaoPreventivaContratual"
    ]},
    { grupo: "Equipamentos", campos: [
      "repprintpoint2", "repprintpoint3", "repminiprint", "repsmart",
      "relogiomicropoint", "relogiobiopoint", "catracamicropoint", "catracabiopoint",
      "catracaceros", "catracaidblock", "catracaidnext", "idface", "idflex"
    ]},
    { grupo: "Componentes", campos: [
      "impressora", "codigoImpressora", "fonte", "codigoFonte",
      "cabecote", "codigoCabecote", "leitor", "codigoLeitor"
    ]},
    { grupo: "Outras Informações", campos: [
      "nSerie", "localinstalacao", "observacaoproblemas",
      "observacoes", "prestadoraDoServico", "tecnico"
    ]}
  ];

  return (
    <div className="importar-planilha-container">
      <Headers links={links} />
      
      <div className="content">
        <h1>Importar Planilha de RACs</h1>
        
        <div className="instructions">
          <h2>Instruções para Importação</h2>
          <p>Sua planilha deve conter as seguintes colunas, nesta ordem:</p>
          
          <div className="campos-planilha">
            {camposPlanilha.map((grupo, index) => (
              <div key={index} className="grupo-campos">
                <h3>{grupo.grupo}:</h3>
                <ul>
                  {grupo.campos.map((campo, i) => (
                    <li key={i}>{campo}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <p className="note">
            <strong>Observação:</strong> Para campos booleanos (como serviços e equipamentos), 
            use "TRUE" ou "FALSE" (sem aspas) ou 1 para verdadeiro e 0 para falso.
          </p>
          
          <a 
            href="/modelo_planilha_rac.xlsx" 
            download 
            className="download-template"
          >
            Baixar Modelo de Planilha
          </a>
        </div>
        
        <form onSubmit={handleFileUpload} className="upload-form">
          <div className="file-input-container">
            <label htmlFor="file-upload" className="file-upload-label">
              Selecione a Planilha (.xlsx)
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="file-input"
            />
            {file && (
              <div className="file-info">
                Arquivo selecionado: {file.name}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={!file || isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Planilha'}
          </button>
          
          {uploadStatus && (
            <div className={`status-message ${uploadStatus.includes('sucesso') ? 'success' : 'error'}`}>
              {uploadStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}