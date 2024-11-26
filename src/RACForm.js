import React, { useState, } from 'react';
import axios from 'axios';
import Headers from './Components/Headers.js'
import './RACForm.css'
import './my-button.css'


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
    implantacaoDeSistemas: false,
    manutencaoPreventivaContratual: false,
    repprintpoint: false,
    repminiprint: false,
    repsmart: false,
    relogiomicropoint: false,
    relogiobiopoint: false,
    catracamicropoint: false,
    catracabiopoint: false,
    catracaceros: false,
    catracaidblock: false,
    catracaidnext: false,
    idface: false,
    idflex: false,
    nSerie: '',
    localinstalacao: '',
    observacaoproblemas: '',
    componente: '',
    codigocomponente: '',
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
      const response = await axios.post('http://localhost:3004/racvirtual/register', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar os dados!');
    }
  };
  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Home', url: '/' },
  ]
 
  return (
<>
    <Headers links={links} />
    <form class="form-group" onSubmit={handleSubmit}>
  
    <label htmlFor="tecnico">Técnico</label>
    <input type="text" id="tecnico" name="tecnico" value={formData.tecnico} onChange={handleChange} placeholder="Técnico" required />

    <label htmlFor="razaoSocial">Razão Social</label>
    <input type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} placeholder="Razão Social" />

    <label htmlFor="cnpj">CNPJ</label>
    <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" required />

    <label htmlFor="endereco">Endereço</label>
    <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" required />

    <label htmlFor="numero">Número</label>
    <input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required />

    <label htmlFor="responsavel">Responsável</label>
    <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Responsável" required />

    <label htmlFor="setor">Setor</label>
    <input type="text" id="setor" name="setor" value={formData.setor} onChange={handleChange} placeholder="Setor" required />

    <label htmlFor="cidade">Cidade</label>
    <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required />

    <label htmlFor="horaInicio">Hora Início</label>
    <input type="datetime-local" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} placeholder="Hora Início" />

    <label htmlFor="horaTermino">Hora Término</label>
    <input type="datetime-local" id="horaTermino" name="horaTermino" value={formData.horaTermino} onChange={handleChange} placeholder="Hora Término" />
    
    <label htmlFor="instalacaoDeEquipamentos">Instalação de Equipamentos</label>
    <input type="checkbox" id="instalacaoDeEquipamentos" name="instalacaoDeEquipamentos" value={formData.instalacaoDeEquipamentos} onChange={handleChange} />
    
    <label htmlFor="manutencaoDeEquipamentos">Manutenção de Equipamentos</label>
    <input type="checkbox" id="manutencaoDeEquipamentos" name="manutencaoDeEquipamentos" value={formData.manutencaoDeEquipamentos} onChange={handleChange} />
    
    <label htmlFor="homologacaodeinfra">Homologação de Infra</label>
    <input type="checkbox" id="homologacaodeinfra" name="homologacaodeinfra" value={formData.homologacaodeinfra} onChange={handleChange} />
    
    <label htmlFor="treinamentooperacional">Treinamento Operacional</label>
    <input type="checkbox" id="treinamentooperacional" name="treinamentooperacional" value={formData.treinamentooperacional} onChange={handleChange} />
    
    <label htmlFor="implantacaoDeSistemas">Implantação de Sistemas</label>
    <input type="checkbox" id="implantacaoDeSistemas" name="implantacaoDeSistemas" value={formData.implantacaoDeSistemas} onChange={handleChange} />
    
    <label htmlFor="manutencaoPreventivaContratual">Manutenção Preventiva Contratual</label>
    <input type="checkbox" id="manutencaoPreventivaContratual" name="manutencaoPreventivaContratual" value={formData.manutencaoPreventivaContratual} onChange={handleChange} />
    
    <label htmlFor="repprintpoint">REP Print Point</label>
    <input type="checkbox" id="repprintpoint" name="repprintpoint" value={formData.repprintpoint} onChange={handleChange} />
    
  
      <label>repminiprint</label><br/>
      <input type="checkbox" name="repminiprint" value={formData.repminiprint} onChange={handleChange} placeholder="REP Mini Print" />
      <label>repsmart</label>
      <input type="checkbox" name="repsmart" value={formData.repsmart} onChange={handleChange} placeholder="REP Smart" />
      <label>relogiomicropoint</label><br/>
      <input type="checkbox" name="relogiomicropoint" value={formData.relogiomicropoint} onChange={handleChange} placeholder="REP Micropoint" />
      <label>relogiobiopoint</label>
      <input type="checkbox" name="relogiobiopoint" value={formData.relogiobiopoint} onChange={handleChange} placeholder="REP Biopoint" />
      <label>catracamicropoint</label><br/>
      <input type="checkbox" name="catracamicropoint" value={formData.catracamicropoint} onChange={handleChange} placeholder="Catraca Micropoint" />
      <label>catracabiopoint</label>
      <input type="checkbox" name="catracabiopoint" value={formData.catracabiopoint} onChange={handleChange} placeholder="Catraca Biopoint" />
      <label>Catraca Ceros</label>
      <input type="checkbox" name="catracaceros" value={formData.catracaceros} onChange={handleChange} placeholder="Catraca Ceros" />
      <label>Catraca ID Block</label>
      <input type="checkbox" name="catracaidblock" value={formData.catracaidblock} onChange={handleChange} placeholder="catracaidblock" />
      <label>Catraca ID Next</label>
      <input type="checkbox" name="catracaidnext" value={formData.catracaidnext} onChange={handleChange} placeholder="catracaidnext" />
      <label>ID Face</label>
      <input type="checkbox" name="idface" value={formData.idface} onChange={handleChange} placeholder="Id Face" />
      <label>ID Flex</label>
      <input type="checkbox" name="idflex" value={formData.idflex} onChange={handleChange} placeholder="Id Flex " />
      

    
        <label htmlFor="nSerie">Número de Série</label>
    <input type="text" id="nSerie" name="nSerie" value={formData.nSerie} onChange={handleChange} placeholder="Número de Série" required />

    <label htmlFor="localinstalacao">Local de Instalação</label>
    <input type="text" id="localinstalacao" name="localinstalacao" value={formData.localinstalacao} onChange={handleChange} placeholder="Local de Instalação" required />

    <label htmlFor="observacaoproblemas">Observação do Problema</label>
    <input type="text" id="observacaoproblemas" name="observacaoproblemas" value={formData.observacaoproblemas} onChange={handleChange} placeholder="Observação dos Problemas" required />

    <label htmlFor="componente">Componente</label>
    <input type="text" id="componente" name="componente" value={formData.componente} onChange={handleChange} placeholder="Componente" required />

    <label htmlFor="codigocomponente">Código de Componente</label>
    <input type="text" id="codigocomponente" name="codigocomponente" value={formData.codigocomponente} onChange={handleChange} placeholder="Código do Componente" required />

    <label htmlFor="observacoes">Observações</label>
    <input type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações" required />
  

  <button type="submit">Enviar</button>
</form>
  
    </>
  );
}

export default RacForm;