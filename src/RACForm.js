import React, { useState, } from 'react';
import axios from 'axios';
import Headers from './Components/Headers.js'


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
    <form onSubmit={handleSubmit}>
      <label>Tecnico</label>
      <input type="text" name="tecnico" value={formData.tecnico} onChange={handleChange} placeholder="Técnico" required />
      <label>Razão Social</label>
      <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} placeholder="Razão Social" />
      <label>CNPJ</label>
      <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" required />
      <label>Endereço</label>
      <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" required />
      <label>Número</label>
      <input type="text" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required />
      <label>Responsável</label>
      <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Responsável" required />
      <label>Setor</label>
      <input type="text" name="setor" value={formData.setor} onChange={handleChange} placeholder="Setor" required />
      <label>Cidade</label>
      <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required />

      <label>Hora Início</label>
      <input type="datetime-local" min="2024-01-01T00:00" max="2999-12-31T23:59" name="horaInicio" value={formData.horaInicio} onChange={handleChange} placeholder="Hora Início"  />
  
      <label>Hora Termino</label>
      <input type="datetime-local" min="2024-01-01T00:00" max="2999-12-31T23:59" name="horaTermino" value={formData.horaTermino} onChange={handleChange} placeholder="Hora Término"  />
      
      <br/>

      <input type="checkbox" name="instalacaoDeEquipamentos" value={formData.instalacaoDeEquipamentos} onChange={handleChange} placeholder="Instalação de Equipamentos" />
      <label>instalacaodeequipamentos</label><br/>
      <input type="checkbox" name="manutencaoDeEquipamentos" value={formData.manutencaoDeEquipamentos} onChange={handleChange} placeholder="Manutencao de " />
      <label>manutencaodeequipamentos</label>
      <label>diagnosticodeprojetos</label>
      <input type="checkbox" name="homologacaodeinfra" value={formData.homologacaodeinfra} onChange={handleChange} placeholder="Homologação de Infra" />
      <label>homologacaodeinfra</label><br/>

      <input type="checkbox" name="treinamentooperacional" value={formData.treinamentooperacional} onChange={handleChange} placeholder="Treinamento Operacional" />
      <label>treinamentooperacional</label><br/>
      <input type="checkbox" name="implantacaoDeSistemas" value={formData.implantacaoDeSistemas} onChange={handleChange} placeholder="Implantação de Sistemas" />
      <label>implantacaodesistemas</label>
      <input type="checkbox" name="manutencaoPreventivaContratual" value={formData.manutencaoPreventivaContratual} onChange={handleChange} placeholder="Manutenção Preventiva Contratual" />
      <label>manutencaopreventivacontratual</label><br/>
      <input type="checkbox" name="repprintpoint"  value={formData.repprintpoint} onChange={handleChange} placeholder="REP Print Point" />
      <label>repprintpoint</label>
      <input type="checkbox" name="repminiprint" value={formData.repminiprint} onChange={handleChange} placeholder="REP Mini Print" />
      <label>repminiprint</label><br/>
      <input type="checkbox" name="repsmart" value={formData.repsmart} onChange={handleChange} placeholder="REP Smart" />
      <label>repsmart</label>
      <input type="checkbox" name="relogiomicropoint" value={formData.relogiomicropoint} onChange={handleChange} placeholder="REP Micropoint" />
      <label>relogiomicropoint</label><br/>
      <input type="checkbox" name="relogiobiopoint" value={formData.relogiobiopoint} onChange={handleChange} placeholder="REP Biopoint" />
      <label>relogiobiopoint</label>
      <input type="checkbox" name="catracamicropoint" value={formData.catracamicropoint} onChange={handleChange} placeholder="Catraca Micropoint" />
      <label>catracamicropoint</label><br/>
      <input type="checkbox" name="catracabiopoint" value={formData.catracabiopoint} onChange={handleChange} placeholder="Catraca Biopoint" />
      <label>catracabiopoint</label>
      <input type="checkbox" name="catracaceros" value={formData.catracaceros} onChange={handleChange} placeholder="Catraca Ceros" />
      <label>Catraca Ceros</label>
      <input type="checkbox" name="catracaidblock" value={formData.catracaidblock} onChange={handleChange} placeholder="catracaidblock" />
      <label>Catraca ID Block</label>
      <input type="checkbox" name="catracaidnext" value={formData.catracaidnext} onChange={handleChange} placeholder="catracaidnext" />
      <label>Catraca ID Next</label>
      <input type="checkbox" name="idface" value={formData.idface} onChange={handleChange} placeholder="Id Face" />
      <label>ID Face</label>
      <input type="checkbox" name="idflex" value={formData.idflex} onChange={handleChange} placeholder="Id Flex " />
      <label>ID Flex</label>

      <label>Número de Série</label>
      <input type="text" name="nSerie" value={formData.nSerie} onChange={handleChange} placeholder="Número de Série" required />
      <label>Local de Instalação</label>
      <input type="text" name="localinstalacao" value={formData.localinstalacao} onChange={handleChange} placeholder="Local de Instalação" required />
      <label>Observação do Problema</label>
      <input type="text" name="observacaoproblemas" value={formData.observacaoproblemas} onChange={handleChange} placeholder="Observação dos Problemas" required />
      <label>Componente</label>
      <input type="text" name="componente" value={formData.componente} onChange={handleChange} placeholder="Componente" required />
      <label>Código de Componente</label>
      <input type="text" name="codigocomponente" value={formData.codigocomponente} onChange={handleChange} placeholder="Código do Componente" required />
      <label>Observações</label>
      <input type="text" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações" required />
      <button type="submit">Enviar</button><br/>

    </form>
    </>
  );
}

export default RacForm;