import React, { useState } from 'react'
import axios from 'axios'
import Headers from './Components/Headers'

export default function importarPlanilha(){


// Função para enviar o arquivo da planilha para o backend
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  
  if (file && file.name.endsWith('.xlsx')) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await axios.post('http://localhost:3000/racvirtual/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Dados da planilha importados:', response.data.data)

      // Aqui você pode processar os dados recebidos da planilha
      alert('Planilha importada com sucesso!')
    } catch (error) {
      alert('Erro ao importar planilha')
      console.error(error)
    }
  } else {
    alert('Por favor, selecione um arquivo .xlsx')
  }
}


const links = [
  { label: 'Autenticacao', url: '/Autenticacao' },
  { label: 'Perfil', url: '/perfil' },
  { label: 'Consultar Racs', url: '/racscadastradas' },
  { label: 'Registrar Nova RAC', url: '/novarac' },
  { label: 'Home', url: '/' },
]

return (
  <div>
    
    <Headers links={links} />

    <input type="file" name="file" accept=".xlsx" onChange={handleFileUpload} />

    {/* Outros componentes do formulário */}
  </div>
)
}