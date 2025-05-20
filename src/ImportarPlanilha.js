import React, { useState } from 'react';
import axios from 'axios';
import Headers from './Components/Headers';
import './importarPlanilha.css'

export default function ImportarPlanilha() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.post('http://localhost:3000/racvirtual/upload', formData, {
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

  const camposPlanilha = [
    { 
      grupo: "Informações da Empresa", 
      campos: [
        "A1: tecnico",
        "A2: razaoSocial",
        "A3: cnpj",
        "A4: endereco",
        "A5: numero",
        "A6: responsavel",
        "A7: setor",
        "A8: cidade"
      ]
    },
    { 
      grupo: "Datas e Horários", 
      campos: [
        "C1: dataInicio (DD/MM/AAAA)",
        "C2: horaInicio (HH:MM)",
        "C3: dataTermino (DD/MM/AAAA)",
        "C4: horaTermino (HH:MM)",
        "C5: horaIntervaloInicio (HH:MM)",
        "C6: horaIntervaloTermino (HH:MM)",
        "C7: horaIntervaloInicio2 (HH:MM)",
        "C8: horaIntervaloTermino2 (HH:MM)"
      ]
    },
    { 
      grupo: "Serviços Prestados (1 para Sim, 0 para Não)", 
      campos: [
        "E1: instalacaoDeEquipamentos",
        "E2: manutencaoDeEquipamentos",
        "E3: homologacaoDeInfra",
        "E4: treinamentoOperacional",
        "E5: implantacaoDeSistemas",
        "E6: manutencaoPreventivaContratual"
      ]
    },
    { 
      grupo: "Equipamentos (1 para Sim, 0 para Não)", 
      campos: [
        "G1: repprintpoint2",
        "G2: repprintpoint3",
        "G3: repminiprint",
        "G4: repsmart",
        "G5: relogiomicropoint",
        "G6: relogiobiopoint",
        "G7: catracamicropoint",
        "G8: catracabiopoint",
        "G9: catracaceros",
        "G10: catracaidblock",
        "G11: catracaidnext",
        "G12: idface",
        "G13: idflex"
      ]
    },
    { 
      grupo: "Componentes", 
      campos: [
        "I1: impressora (1 para Sim, 0 para Não)",
        "I2: fonte (1 para Sim, 0 para Não)",
        "I3: cabecote (1 para Sim, 0 para Não)",
        "I4: leitor (1 para Sim, 0 para Não)",
        "I5: codigoImpressora (preencher apenas se impressora=1)",
        "I6: codigoFonte (preencher apenas se fonte=1)",
        "I7: codigoCabecote (preencher apenas se cabecote=1)",
        "I8: codigoLeitor (preencher apenas se leitor=1)"
      ]
    },
    { 
      grupo: "Outras Informações", 
      campos: [
        "K1: nSerie",
        "K2: localinstalacao",
        "K3: observacaoproblemas",
        "K4: observacoes",
        "K5: prestadoraDoServico"
      ]
    }
  ];

  return (
    <div className="importar-planilha-container">
      <Headers links={links} />
      
      <div className="content-importarplanilha">
        <h1>Importar Planilha de RACs</h1>
        
        <div className="instructions">
          <h2>Instruções para Importação</h2>
          <p>Sua planilha deve seguir exatamente este formato:</p>
          
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
          
          <h2 className="note">
            <strong>Observação:</strong> Para campos booleanos (como serviços e equipamentos), 
            use 1 para verdadeiro e 0 para falso. Os códigos de componentes só serão considerados
            se o componente correspondente estiver marcado como 1.
          </h2>
          
      
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