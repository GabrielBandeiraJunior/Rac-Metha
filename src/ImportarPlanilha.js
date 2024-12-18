import React, { useState } from "react";
import * as XLSX from "xlsx";
import Headers from './Components/Headers.js';

const ImportarPlanilha = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para lidar com a seleção do arquivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcel(selectedFile);
    }
  };

  // Função para ler o arquivo Excel
  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Pega a primeira planilha
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Converte para JSON
      setData(jsonData); // Armazena os dados da planilha
    };
    reader.readAsBinaryString(file);
  };

  // Função para validar os dados
  const validateData = (data) => {
    // Aqui você pode fazer a validação dos dados
    // Verifica se existe ao menos uma linha e se as células essenciais estão preenchidas
    if (data.length === 0) {
      return "Nenhum dado encontrado na planilha.";
    }

    // Exemplo: Verifica se a primeira linha tem dados essenciais
    const firstRow = data[1]; // Primeira linha (sem contar o cabeçalho)
    if (!firstRow[0] || !firstRow[1]) {
      return "Dados essenciais não encontrados na planilha.";
    }

    return null;
  };

  // Função para enviar os dados para o backend
  const sendDataToDatabase = async () => {
    // Validar dados antes de enviar
    const validationError = validateData(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Enviar os dados para o backend
      const response = await fetch("http://localhost:3000/api/importar-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: data }), // Envia os dados lidos da planilha
      });

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Falha na importação dos dados.');
      }

      const result = await response.json();
      console.log("Dados importados com sucesso:", result);
      alert("Dados importados com sucesso!");
      setData([]); // Limpar os dados após a importação
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setError("Erro ao importar dados.");
    }

    setLoading(false);
  };


  const links = [
        { label: 'Home', url: '/' },
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova RAC', url: '/novarac' },
  ];



  return (
    <div>
        <Headers links={links}/>
    
    <div className="import-excel">
      <h2>Importar Planilha Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

      {file && (
        <div>
          <h3>Arquivo selecionado: {file.name}</h3>
          <button onClick={sendDataToDatabase} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Dados para o Banco de Dados"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {data.length > 0 && (
        <div>
          <h3>Dados lidos da planilha:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default ImportarPlanilha;
