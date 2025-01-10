import React, { useState } from 'react';
import axios from 'axios';
import Headers from './Components/Headers.js';
import './RACForm.css';
import './my-button.css';

function RacForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tecnico: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    numero: '',
    cidade: '',
    responsavel: '',
    setor: '',
    dataInicio: '',
    horaInicio: '',
    dataTermino: '',
    horaTermino: '',
    instalacaoDeEquipamentos: false,
    manutencaoDeEquipamentos: false,
    homologacaoDeInfra: false,
    treinamentoOperacional: false,
    implantacaoDeSistemas: false,
    manutencaoPreventivaContratual: false,
    repprintpoint2: false,
    repprintpoint3: false,
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
    localInstalacao: '',
    observacaoProblemas: '',
    componente: '',
    codigoComponente: '',
    observacoes: '',
    prestadoraDoServico: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    console.log(`${name}: ${type === 'checkbox' ? checked : value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ajustar checkboxes para garantir valores booleanos
    const checkboxes = [
      'instalacaoDeEquipamentos',
      'manutencaoDeEquipamentos',
      'homologacaoDeInfra',
      'treinamentoOperacional',
      'implantacaoDeSistemas',
      'manutencaoPreventivaContratual',
      'repprintpoint2',
      'repprintpoint3',
      'repminiprint',
      'repsmart',
      'relogiomicropoint',
      'relogiobiopoint',
      'catracamicropoint',
      'catracabiopoint',
      'catracaceros',
      'catracaidblock',
      'catracaidnext',
      'idface',
      'idflex',
    ];
  
    // Certifique-se de que todas as checkboxes têm valores explícitos (true/false)
    const updatedFormData = {
      ...formData,
      ...Object.fromEntries(checkboxes.map((checkbox) => [checkbox, !!formData[checkbox]])),
    };
  
    try {
      const response = await axios.post('http://localhost:3000/racvirtual/register', updatedFormData);
      console.log(response.data.message);
      alert('Dados enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar os dados.');
    }
  };

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Home', url: '/' },
  ];

  return (
    <>
      <Headers links={links} />
      <form className="form-group" onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <label htmlFor="tecnico">Nome do Técnico</label>
        <input type="text" id="tecnico" name="tecnico" value={formData.tecnico} onChange={handleChange} placeholder="Nome do Técnico" required />
        
        <label htmlFor="razaoSocial">Razão Social da Empresa</label>
        <input type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} placeholder="Razão Social da Empresa" />
        
        <label htmlFor="cnpj">CNPJ da Empresa</label>
        <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ da Empresa" required />
        
        <label htmlFor="endereco">Endereço Completo</label>
        <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço Completo" required />
        
        <label htmlFor="numero">Número do Endereço</label>
        <input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número do Endereço" required />
        
        <label htmlFor="responsavel">Nome do Responsável</label>
        <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Nome do Responsável" required />
        
        <label htmlFor="setor">Setor da Empresa</label>
        <input type="text" id="setor" name="setor" value={formData.setor} onChange={handleChange} placeholder="Setor da Empresa" required />
        
        <label htmlFor="cidade">Cidade da Empresa</label>
        <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade da Empresa" required />
        
        <label htmlFor="dataInicio">Data de Início da Atividade</label>
        <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleChange} placeholder="Data de Início da Atividade" />

        <label htmlFor="horaInicio">Hora de Início da Atividade</label>
        <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} placeholder="Hora de Início da Atividade" />
        
        <label htmlFor="dataTermino">Data de Término da Atividade</label>
        <input type="date" id="dataTermino" name="dataTermino" value={formData.dataTermino} onChange={handleChange} placeholder="Data de Término da Atividade" />

        <label htmlFor="horaTermino">Hora de Término da Atividade</label>
        <input type="time" id="horaTermino" name="horaTermino" value={formData.horaTermino} onChange={handleChange} placeholder="Hora de Término da Atividade" />
        
        {/* Campos de checkbox */}
        <label htmlFor="instalacaoDeEquipamentos">Instalação de Equipamentos</label>
        <input type="checkbox" id="instalacaoDeEquipamentos" name="instalacaoDeEquipamentos" checked={formData.instalacaoDeEquipamentos} onChange={handleChange} />
        
        <label htmlFor="manutencaoDeEquipamentos">Manutenção de Equipamentos</label>
        <input type="checkbox" id="manutencaoDeEquipamentos" name="manutencaoDeEquipamentos" checked={formData.manutencaoDeEquipamentos} onChange={handleChange} />
        
        <label htmlFor="homologacaoDeInfra">Homologação de Infraestrutura</label>
        
        <input type="checkbox" id="homologacaoDeInfra" name="homologacaoDeInfra" 
          checked={formData.homologacaoDeInfra} 
          onChange={handleChange} 
        />
                
        <label htmlFor="treinamentoOperacional">Treinamento Operacional</label>
        <input type="checkbox" id="treinamentoOperacional" name="treinamentoOperacional" checked={formData.treinamentoOperacional} onChange={handleChange} />
        
        <label htmlFor="implantacaoDeSistemas">Implantação de Sistemas</label>
        <input type="checkbox" id="implantacaoDeSistemas" name="implantacaoDeSistemas" checked={formData.implantacaoDeSistemas} onChange={handleChange} />
        
        <label htmlFor="manutencaoPreventivaContratual">Manutenção Preventiva Contratual</label>
        <input type="checkbox" id="manutencaoPreventivaContratual" name="manutencaoPreventivaContratual" checked={formData.manutencaoPreventivaContratual} onChange={handleChange} />
        
        <label htmlFor="repprintpoint2">REP Print Point2</label>
        <input type="checkbox" id="repprintpoint2" name="repprintpoint2" checked={formData.repprintpoint2} onChange={handleChange} />

        <label htmlFor="repprintpoint3">REP Print Point3</label>
        <input type="checkbox" id="repprintpoint3" name="repprintpoint3" checked={formData.repprintpoint3} onChange={handleChange} />
        
        <label htmlFor="repminiprint">REP Mini Print</label>
        <input type="checkbox" id="repminiprint" name="repminiprint" checked={formData.repminiprint} onChange={handleChange} />
        
        <label htmlFor="repsmart">REP Smart</label>
        <input type="checkbox" id="repsmart" name="repsmart" checked={formData.repsmart} onChange={handleChange} />
        
        <label htmlFor="relogiomicropoint">Relógio Micropoint</label>
        <input type="checkbox" id="relogiomicropoint" name="relogiomicropoint" checked={formData.relogiomicropoint} onChange={handleChange} />
        
        <label htmlFor="relogiobiopoint">Relógio Biopoint</label>
        <input type="checkbox" id="relogiobiopoint" name="relogiobiopoint" checked={formData.relogiobiopoint} onChange={handleChange} />
        
        <label htmlFor="catracamicropoint">Catraca Micropoint</label>
        <input type="checkbox" id="catracamicropoint" name="catracamicropoint" checked={formData.catracamicropoint} onChange={handleChange} />
        
        <label htmlFor="catracabiopoint">Catraca Biopoint</label>
        <input type="checkbox" id="catracabiopoint" name="catracabiopoint" checked={formData.catracabiopoint} onChange={handleChange} />
        
        <label htmlFor="catracaceros">Catraca Acero</label>
        <input type="checkbox" id="catracaceros" name="catracaceros" checked={formData.catracaceros} onChange={handleChange} />
        
        <label htmlFor="catracaidblock">Catraca ID Block</label>
        <input type="checkbox" id="catracaidblock" name="catracaidblock" checked={formData.catracaidblock} onChange={handleChange} />
        
        <label htmlFor="catracaidnext">Catraca ID Next</label>
        <input type="checkbox" id="catracaidnext" name="catracaidnext" checked={formData.catracaidnext} onChange={handleChange} />
        
        <label htmlFor="idface">ID Face</label>
        <input type="checkbox" id="idface" name="idface" checked={formData.idface} onChange={handleChange} />
        
        <label htmlFor="idflex">ID Flex</label>
        <input type="checkbox" id="idflex" name="idflex" checked={formData.idflex} onChange={handleChange} />
        
        <label htmlFor="nSerie">Número de Série</label>
        <input type="text" id="nSerie" name="nSerie" value={formData.nSerie} onChange={handleChange} placeholder="Número de Série" />
        
        <label htmlFor="localInstalacao">Local de Instalação</label>
        <input type="text" id="localInstalacao" name="localInstalacao" value={formData.localInstalacao} onChange={handleChange} placeholder="Local de Instalação" />
        
        <label htmlFor="observacaoProblemas">Observações sobre os Problemas</label>
        <input type="text" id="observacaoProblemas" name="observacaoProblemas" value={formData.observacaoProblemas} onChange={handleChange} placeholder="Observações sobre os Problemas" />
        
        <label htmlFor="componente">Componente</label>
        <input type="text" id="componente" name="componente" value={formData.componente} onChange={handleChange} placeholder="Componente" />
        
        <label htmlFor="codigoComponente">Código do Componente</label>
        <input type="text" id="codigoComponente" name="codigoComponente" value={formData.codigoComponente} onChange={handleChange} placeholder="Código do Componente" />
        
        <label htmlFor="observacoes">Observações Gerais</label>
        <input type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações Gerais" />
        
        <label htmlFor="prestadoraDoServico">Prestadora de Serviço</label>

        <label htmlFor="prestadoraDoServico">Prestadora de Serviço</label>
        <select
        id="prestadoraDoServico"
        name="prestadoraDoServico"
        checked={formData.prestadoraDoServico}
        onChange={handleChange}
        required
      >
        <option value="">Selecione a Prestadora</option>
        <option value="Mega Digital">Mega Digital</option>
        <option value="Metah">Metah</option>
      </select>
        {/* Enviar */}
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default RacForm;