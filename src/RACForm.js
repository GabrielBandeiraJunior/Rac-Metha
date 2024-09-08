import React, { useState } from 'react';
import axios from 'axios';

function RacForm() {
  const [formData, setFormData] = useState({
    tecnico: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    numero: '',
    responsavel: '',
    setor: '',
    cidade: '',
    horaInicio: '',
    horaTermino: '',
    instalacaoDeEquipamentos: false,
    manutencaoDeEquipamentos: false,
    customizacao: false,
    diagnosticoDeProjetos: false,
    homologacaoDeInfra: false,
    deslocamento: false,
    treinamentoOperacional: false,
    implantacaoDeSistemas: false,
    manutencaoPreventivaContratual: false,
    repprintpoint: false,
    repminiprint: false,
    repsmart: false,
    relogiomicropoint: false,
    relogiobiopoint: false,
    catracamicropoint: false,
    catracabiopoint: false,
    suporteTi: false,
    outros: '',
    nSerie: '',
    localInstalacao: '',
    observacaoProblemas: '',
    componente: '',
    codigoComponente: '',
    valorVisita: '',
    valorrs: '',
    valorPecas: '',
    valorTotal: '',
    observacoes: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/racvirtual/register', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar os dados!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="tecnico" value={formData.tecnico} onChange={handleChange} placeholder="Técnico" required />
      <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} placeholder="Razão Social" />
      <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" required />
      <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" required />
      <input type="text" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required />
      <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Responsável" required />
      <input type="text" name="setor" value={formData.setor} onChange={handleChange} placeholder="Setor" required />
      <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required />
      <input type="text" name="horaInicio" value={formData.horaInicio} onChange={handleChange} placeholder="Hora Início" required />
      <input type="text" name="horaTermino" value={formData.horaTermino} onChange={handleChange} placeholder="Hora Término" required />
      {/* A*/}
      <button type="submit">Enviar</button>
    </form>
  );
}

export default RacForm;
