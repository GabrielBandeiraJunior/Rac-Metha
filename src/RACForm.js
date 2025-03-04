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
    horaIntervaloInicio: '',
    horaIntervaloTermino: '',
    horaIntervaloInicio2: '',
    horaIntervaloTermino2: '',
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
    componentes: '',
    codigoComponente: '',
    observacoes: '',
    prestadoraDoServico: '',
  });

  const [step, setStep] = useState(1);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({});
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const obterEnderecoPorCEP = async () => {
    try {
      const response = await fetch(`http://localhost:3000/endereco/${cep}`);
      if (!response.ok) {
        throw new Error('Erro ao obter o endereço.');
      }
      const data = await response.json();
      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }
      setEndereco(data);
      setErro('');

      // Monta o endereço completo e atualiza o estado
      const enderecoCompleto = `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''}, ${data.uf || ''}`;
      setFormData((prevState) => ({
        ...prevState,
        endereco: enderecoCompleto.trim(), // Remove espaços extras
        cidade: data.localidade || '', // Preenche a cidade automaticamente
      }));
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao buscar o endereço. Verifique o CEP e tente novamente.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/racvirtual/register',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        alert('Dados enviados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar dados. Tente novamente.');
    }
  };

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Importar Planilha', url: '/importarplanilha' },
    { label: 'Home', url: '/' },
  ];

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <>
      <Headers links={links} />
      <form className="form-group" onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-page">
            <label htmlFor="tecnico">Nome do Técnico</label>
            <input type="text" id="tecnico" name="tecnico" value={formData.tecnico} onChange={handleChange} placeholder="Nome do Técnico" />

            <label htmlFor="razaoSocial">Razão Social da Empresa</label>
            <input type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} placeholder="Razão Social da Empresa" />

            <label htmlFor="cnpj">CNPJ da Empresa</label>
            <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ da Empresa" />

            <h2>Consulta de Endereço por CEP</h2>
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Digite o CEP"
            />
            <button type="button" id="btnConsultar" onClick={obterEnderecoPorCEP}>
              Consultar
            </button>

            {/* <div id="enderecoResultado">
              {erro ? (
                <p style={{ color: 'red' }}>{erro}</p>
              ) : (
                <>
                  <p>
                    <strong>Rua:</strong> <span id="rua">{endereco.logradouro || 'Não informado'}</span>
                  </p>
                  <p>
                    <strong>Cidade:</strong> <span id="cidade">{endereco.localidade || 'Não informado'}</span>
                  </p>
                  <p>
                    <strong>Estado:</strong> <span id="estado">{endereco.uf || 'Não informado'}</span>
                  </p>
                </>
              )}
            </div> */}

            <label htmlFor="endereco">Endereço Completo</label>
            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço Completo" />

            {/* <label htmlFor="cidade">Cidade da Empresa</label>
            <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade da Empresa" /> */}

            <label htmlFor="numero">Número do Endereço</label>
            <input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número do Endereço" />

            

            <label htmlFor="responsavel">Nome do Responsável</label>
            <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Nome do Responsável" />

            <label htmlFor="setor">Setor da Empresa</label>
            <input type="text" id="setor" name="setor" value={formData.setor} onChange={handleChange} placeholder="Setor da Empresa" />

            <label htmlFor="dataInicio">Data de Início da Atividade</label>
            <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleChange} />

            <label htmlFor="horaInicio">Hora de Início da Atividade</label>
            <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} />

            <label htmlFor="dataTermino">Data de Término da Atividade</label>
            <input type="date" id="dataTermino" name="dataTermino" value={formData.dataTermino} onChange={handleChange} />

            <label htmlFor="horaTermino">Hora de Término da Atividade</label>
            <input type="time" id="horaTermino" name="horaTermino" value={formData.horaTermino} onChange={handleChange} />

            <div className="container-intervalo">
              <label htmlFor="horaIntervaloInicio">Hora de Início do Intervalo</label>
              <input type="time" id="horaIntervaloInicio" name="horaIntervaloInicio" value={formData.horaIntervaloInicio} onChange={handleChange} />

              <label htmlFor="horaIntervaloTermino">Hora de Término do Intervalo</label>
              <input type="time" id="horaIntervaloTermino" name="horaIntervaloTermino" value={formData.horaIntervaloTermino} onChange={handleChange} />

              <label htmlFor="horaIntervaloInicio2">Hora de Início do Intervalo 2</label>
              <input type="time" id="horaIntervaloInicio2" name="horaIntervaloInicio2" value={formData.horaIntervaloInicio2} onChange={handleChange} />

              <label htmlFor="horaIntervaloTermino2">Hora de Término do Intervalo 2</label>
              <input type="time" id="horaIntervaloTermino2" name="horaIntervaloTermino2" value={formData.horaIntervaloTermino2} onChange={handleChange} />
            </div>

            <button type="button" onClick={handleNextStep}>Próxima Etapa</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-page">
            <label htmlFor="instalacaoDeEquipamentos">Instalação de Equipamentos</label>
            <input type="checkbox" id="instalacaoDeEquipamentos" name="instalacaoDeEquipamentos" checked={formData.instalacaoDeEquipamentos} onChange={handleChange} />

            <label htmlFor="manutencaoDeEquipamentos">Manutenção de Equipamentos</label>
            <input type="checkbox" id="manutencaoDeEquipamentos" name="manutencaoDeEquipamentos" checked={formData.manutencaoDeEquipamentos} onChange={handleChange} />

            <label htmlFor="homologacaoDeInfra">Homologação de Infraestrutura</label>
            <input type="checkbox" id="homologacaoDeInfra" name="homologacaoDeInfra" checked={formData.homologacaoDeInfra} onChange={handleChange} />

            <label htmlFor="treinamentoOperacional">Treinamento Operacional</label>
            <input type="checkbox" id="treinamentoOperacional" name="treinamentoOperacional" checked={formData.treinamentoOperacional} onChange={handleChange} />

            <label htmlFor="implantacaoDeSistemas">Implantação de Sistemas</label>
            <input type="checkbox" id="implantacaoDeSistemas" name="implantacaoDeSistemas" checked={formData.implantacaoDeSistemas} onChange={handleChange} />

            <label htmlFor="manutencaoPreventivaContratual">Manutenção Preventiva Contratual</label>
            <input type="checkbox" id="manutencaoPreventivaContratual" name="manutencaoPreventivaContratual" checked={formData.manutencaoPreventivaContratual} onChange={handleChange} />

            <button type="button" onClick={handlePrevStep}>Etapa Anterior</button>
            <button type="button" onClick={handleNextStep}>Próxima Etapa</button>
          </div>
        )}

        {step === 3 && (
          <div className="form-page">
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

            <label htmlFor="componentes">Componentes</label>
            <select id="componentes" name="componentes" value={formData.componentes} onChange={handleChange}>
              <option value="">Selecione o Componente</option>
              <option value="impressora">Impressora</option>
              <option value="cabecote">Cabecote</option>
              <option value="fonte"> Fonte</option>


            </select>

            <label htmlFor="nSerie">Número de Série</label>
            <input type="text" id="nSerie" name="nSerie" value={formData.nSerie} onChange={handleChange} placeholder="Número de Série" />

            <label htmlFor="localInstalacao">Local de Instalação</label>
            <input type="text" id="localInstalacao" name="localInstalacao" value={formData.localInstalacao} onChange={handleChange} placeholder="Local de Instalação" />

            <label htmlFor="observacaoProblemas">Observações sobre os Problemas</label>
            <input type="text" id="observacaoProblemas" name="observacaoProblemas" value={formData.observacaoProblemas} onChange={handleChange} placeholder="Observações sobre os Problemas" />

            <label htmlFor="codigoComponente">Código do Componente</label>
            <input type="text" id="codigoComponente" name="codigoComponente" value={formData.codigoComponente} onChange={handleChange} placeholder="Código do Componente" />

            <label htmlFor="observacoes">Observações Gerais</label>
            <input type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações Gerais" />

            <label htmlFor="prestadoraDoServico">Prestadora de Serviço</label>
            <select id="prestadoraDoServico" name="prestadoraDoServico" value={formData.prestadoraDoServico} onChange={handleChange}>
              <option value="">Selecione a Prestadora</option>
              <option value="Mega Digital">Mega Digital</option>
              <option value="Metah">Metah</option>
            </select>

            <button type="button" onClick={handlePrevStep}>Etapa Anterior</button>
            <button type="submit">Enviar</button>
          </div>
        )}
      </form>
    </>
  );
}

export default RacForm;