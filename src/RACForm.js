import React, { useState, } from 'react';
import{Link} from 'react-router-dom'
import axios from 'axios';
import Login from './Login.js'


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
    // outros: '',
    // nSerie: '',
    // localInstalacao: '',
    // // observacaoProblemas: '',
    // componente: '',
    // codigoComponente: '',
    // valorVisita: '',
    // valorrs: '',
    // valorPecas: '',
    // valorTotal: '',
    // observacoes: '',
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
<>
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
      <br/>

      <input type="checkbox" name="instalacaoDeEquipamentos" value={formData.instalacaoDeEquipamentos} onChange={handleChange} placeholder="Instalação de Equipamentos" />
      <label>instalacaodeequipamentos</label><br/>
      <input type="checkbox" name="manutencaoDeEquipamentos" value={formData.manutencaoDeEquipamentos} onChange={handleChange} placeholder="Manutencao de " />
      <label>manutencaodeequipamentos</label>
      <input type="checkbox" name="customizacao"             value={formData.customizacao} onChange={handleChange} placeholder="customizacao" />
      <label>customizacao</label><br/>
      <input type="checkbox" name="diagnosticoDeProjetos"   value={formData.diagnosticoDeProjetos} onChange={handleChange} placeholder="diagnosticodeprojetos" />
      <label>diagnosticodeprojetos</label>
      <input type="checkbox" name="homologacaodeinfra"      value={formData.homologacaodeinfra} onChange={handleChange} placeholder="homologacaodeinfra" />
      <label>homologacaodeinfra</label><br/>
      <input type="checkbox" name="deslocamento"           value={formData.deslocamento} onChange={handleChange} placeholder="deslocamento" />
      <label>deslocamento</label>
      <input type="checkbox" name="treinamentooperacional" value={formData.treinamentooperacional} onChange={handleChange} placeholder="treinamentooperacional" />
      <label>treinamentooperacional</label><br/>
      <input type="checkbox" name="implantacaoDeSistemas"   value={formData.implantacaoDeSistemas} onChange={handleChange} placeholder="implantacaodesistemas" />
      <label>implantacaodesistemas</label>
      <input type="checkbox" name="manutencaopreventivacontratual" value={formData.manutencaopreventivacontratual} onChange={handleChange} placeholder="manutencaopreventivacontratual" />
      <label>manutencaopreventivacontratual</label><br/>
      <input type="checkbox" name="repprintpoint"           value={formData.repprintpoint} onChange={handleChange} placeholder="repprintpoint" />
      <label>repprintpoint</label>
      <input type="checkbox" name="repminiprint" value={formData.repminiprint} onChange={handleChange} placeholder="repminiprint" />
      <label>repminiprint</label><br/>
      <input type="checkbox" name="repsmart" value={formData.repsmart} onChange={handleChange} placeholder="repsmart" />
      <label>repsmart</label>
      <input type="checkbox" name="relogiomicropoint" value={formData.relogiomicropoint} onChange={handleChange} placeholder="relogiomicropoint" />
      <label>relogiomicropoint</label><br/>
      <input type="checkbox" name="relogiobiopoint" value={formData.relogiobiopoint} onChange={handleChange} placeholder="relogiobiopoint" />
      <label>relogiobiopoint</label>
      <input type="checkbox" name="catracamicropoint" value={formData.catracamicropoint} onChange={handleChange} placeholder="catracamicropoint" />
      <label>catracamicropoint</label><br/>
      <input type="checkbox" name="catracabiopoint" value={formData.catracabiopoint} onChange={handleChange} placeholder="catracabiopoint" />
      <label>catracabiopoint</label>
      <input type="checkbox" name="suporteTi" value={formData.suporteTi} onChange={handleChange} placeholder="suporteti" />
      <label>suporteti</label><br/>
      

      <input type="text" name="nserie" value={formData.nserie} onChange={handleChange} placeholder="nserie" required />
      <input type="text" name="localinstalacao" value={formData.localinstalacao} onChange={handleChange} placeholder="localinstalacao" required />
      <input type="text" name="observacaoproblemas" value={formData.observacaoproblemas} onChange={handleChange} placeholder="observacaoproblemas" required />
      <input type="text" name="componente" value={formData.componente} onChange={handleChange} placeholder="componente" required />
      <input type="text" name="codigocomponente" value={formData.codigocomponente} onChange={handleChange} placeholder="codigocomponente" required />
      <input type="text" name="valorvisita" value={formData.valorvisita} onChange={handleChange} placeholder="valorvisita" required />
      <input type="text" name="valorrs" value={formData.valorrs} onChange={handleChange} placeholder="valorrs" required />
      <input type="text" name="valorpecas" value={formData.valorpecas} onChange={handleChange} placeholder="valorpecas" required />
      <input type="text" name="valortotal" value={formData.valortotal} onChange={handleChange} placeholder="valortotal" required />
      <input type="text" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="observacoes" required />

      <button type="submit">Enviar</button><br/>
      <br/>
      <br/>
      <Link to="/Login">LOGIN</Link> <br/>
      <Link to="/Register">REGISTER</Link> <br/>
      <Link to="/racscadastradas">Racs Cadastradas</Link> <br/>
      <Link to="/perfil">Meu Perfil</Link>

    </form>
    </>
  );
}

export default RacForm;
