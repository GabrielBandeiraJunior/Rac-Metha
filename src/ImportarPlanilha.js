import React, { useState } from 'react';
import axios from 'axios';
import Headers from './Components/Headers';

export default function ImportarPlanilha() {
  const [status, setStatus] = useState('');

  // Função para enviar o arquivo da planilha para o backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith('.xlsx')) {
      const formData = new FormData();
      formData.append('file', file);
      
      setStatus('Enviando a planilha...');

      try {
        const response = await axios.post('http://localhost:3000/racvirtual/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Dados da planilha importados:', response.data.data);
        setStatus('Planilha importada com sucesso!');
      } catch (error) {
        setStatus('Erro ao importar planilha.');
        console.error(error);
      }
    } else {
      setStatus('Por favor, selecione um arquivo .xlsx');
    }
  };

  const links = [
    { label: 'Autenticação', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Registrar Nova RAC', url: '/novarac' },
    { label: 'Home', url: '/' },
  ];

  return (
    <div>
      <Headers links={links} />
      <input type="file" name="file" accept=".xlsx" onChange={handleFileUpload} />
      {status && <p>{status}</p>}
    </div>
  );
}
