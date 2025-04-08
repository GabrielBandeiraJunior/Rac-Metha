import React, { useState } from 'react'
import axios from 'axios'
import Headers from './Components/Headers.js'
import './RACForm.css'
import './my-button.css'
import Assinatura from './Components/Assinatura.js'
import { motion, AnimatePresence } from 'framer-motion'

const INITIAL_STATE = {
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
  impressora: false,
  fonte: false,
  cabecote: false,
  leitor: false,
  codigoImpressora: '',
  codigoFonte: '',
  codigoCabecote: '',
  codigoLeitor: '',
  nSerie: '',
  localInstalacao: '',
  observacaoProblemas: '',
  observacoes: '',
  prestadoraDoServico: '',
  assinatura: null,
};

export default function RacForm() {
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
    impressora: false,
    fonte: false,
    cabecote: false,
    leitor: false,
    codigoImpressora: '',
    codigoFonte: '',
    codigoCabecote: '',
    codigoLeitor: '',
    nSerie: '',
    localInstalacao: '',
    observacaoProblemas: '',
    observacoes: '',
    prestadoraDoServico: '',
    assinatura: null,
  })

  const [step, setStep] = useState(1)
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState({})
  const [erro, setErro] = useState('')
  const [direction, setDirection] = useState('next')
  const [submitStatus, setSubmitStatus] = useState(null)
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [empresasEncontradas, setEmpresasEncontradas] = useState([]);
  const [showEmpresaPopup, setShowEmpresaPopup] = useState(false);

  const resetForm = () => {
    setFormData({
      ...INITIAL_STATE,
      date: new Date().toISOString().split('T')[0] // Mantém a data atual
    });
    setCep('');
    setEndereco({});
    setErro('');
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSignatureChange = (signature) => {
    setFormData({
      ...formData,
      assinatura: signature
    })
  }

  const obterEnderecoPorCEP = async () => {
    try {
      const response = await fetch(`http://localhost:3000/endereco/${cep}`)
      if (!response.ok) {
        throw new Error('Erro ao obter o endereço.')
      }
      const data = await response.json()
      if (data.erro) {
        throw new Error('CEP não encontrado.')
      }
      setEndereco(data)
      setErro('')

      const enderecoCompleto = `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''}, ${data.uf || ''}`;
      setFormData(prevState => ({
        ...prevState,
        endereco: enderecoCompleto.trim(),
        cidade: data.localidade || '',
      }));
    } catch (error) {
      console.error('Erro:', error)
      setErro(error.message || 'Erro ao buscar o endereço. Verifique o CEP e tente novamente.')
    }
  }

   const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('enviando');

    const timeout = setTimeout(() => {
      setSubmitStatus('erro');
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 10000);
    
    try {
      // Limpa campos vazios antes de enviar
      const payload = { ...formData };
      for (const key in payload) {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      }
  
      const response = await axios.post(
        'http://localhost:3000/racvirtual/register',
        payload,
        { 
          headers: { 'Content-Type': 'application/json' },
          validateStatus: (status) => status < 500
        }
      );

      clearTimeout(timeout);

      console.log('Resposta da API:', response);
      
      if (response.status >= 200 && response.status < 300) {
        setSubmitStatus('sucesso');
        resetForm(); // Usa a função de reset aqui
        
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus('erro');
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error('Erro ao enviar dados:', error);
      
      let errorMessage = 'Erro ao enviar RAC. Por favor, tente novamente.';
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error('Sem resposta do servidor');
        errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
      }
      
      setSubmitStatus('erro');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Consultar Racs', url: '/racscadastradas' },
    { label: 'Cadastrar RAC', url: '/novarac' },
    { label: 'Importar Planilha', url: '/importarplanilha' },
    { label: 'Home', url: '/' },
  ]

  const handleNextStep = () => {
    setDirection('next')
    setTimeout(() => setStep(step + 1), 100)
  }

  const handlePrevStep = () => {
    setDirection('prev')
    setTimeout(() => setStep(step - 1), 100)
  }

  const fetchSuggestions = async (term) => {
    try {
      const response = await axios.get(`http://localhost:3000/empresas/buscar?termo=${term}`);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSuggestions([]);
    }
  };
  
  const handleRazaoSocialChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, razaoSocial: value });
    setSearchTerm(value);
    
    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = async (empresa) => {
    try {
      // Busca os detalhes completos da empresa
      const response = await axios.get(`http://localhost:3000/empresas/${empresa.id}`);
      const empresaCompleta = response.data;
      
      // Atualiza o formulário com os dados da empresa
      setFormData({
        ...formData,
        razaoSocial: empresaCompleta.razaoSocial,
        cnpj: empresaCompleta.cnpj || '',
        endereco: empresaCompleta.endereco || '',
        numero: empresaCompleta.numero || '',
        cidade: empresaCompleta.cidade || '',
        // Adicione outros campos conforme necessário
      });
      
      setSearchTerm(empresaCompleta.razaoSocial);
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Erro ao carregar detalhes da empresa:', error);
    }
  };

  const buscarEmpresa = async () => {
    if (searchTerm.length < 3) {
      alert('Digite pelo menos 3 caracteres para buscar');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/empresas/buscar?termo=${searchTerm}`);
      setEmpresasEncontradas(response.data);
      setShowEmpresaPopup(true);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      alert('Erro ao buscar empresas');
    }
  };
  
  const selecionarEmpresa = async (empresa) => {
    try {
      const response = await axios.get(`http://localhost:3000/empresas/${empresa.id}`);
      const dadosEmpresa = response.data;
      
      setFormData({
        ...formData,
        razaoSocial: dadosEmpresa.razaoSocial,
        cnpj: dadosEmpresa.cnpj || '',
        endereco: dadosEmpresa.endereco || '',
        numero: dadosEmpresa.numero || '',
        cidade: dadosEmpresa.cidade || '',
        responsavel: dadosEmpresa.responsavel || '',
        setor: dadosEmpresa.setor || ''
      });
      
      setShowEmpresaPopup(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
      alert('Erro ao carregar dados da empresa');
    }
  };

  return (
    <>
      <Headers links={links} />
      <form className="form-container" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: direction === 'next' ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 'next' ? '-100%' : '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="form-page"
          >
            {step === 1 && (
              <div className="form-page">
                {/* Seção 1: Dados do Técnico e Empresa */}
                <div className="form-section">
                  <h3 className="section-title">Dados do Técnico e Empresa</h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="tecnico">Nome do Técnico</label>
                      <input type="text" id="tecnico" name="tecnico" value={formData.tecnico} onChange={handleChange} />
                    </div>


                    <div className="input-group">
  <label>Buscar Empresa Cadastrada</label>
  <div className="search-container">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Digite o nome da empresa"
    />
    <button 
      type="button" 
      className="small-button" 
      onClick={buscarEmpresa}
    >
      Buscar
    </button>
  </div>
</div>

                    <div className="input-group">
                      <label htmlFor="razaoSocial">Razão Social</label>
                      <input type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="cnpj">CNPJ</label>
                      <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="responsavel">Responsável</label>
                      <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Endereço */}
                <div className="form-section">
                  <h3 className="section-title">Endereço</h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="cep">CEP</label>
                      <div className="input-with-button">
                        <input type="text" id="cep" value={cep} onChange={(e) => setCep(e.target.value)} />
                        <button type="button" className="small-button" onClick={obterEnderecoPorCEP}>Consultar</button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label htmlFor="endereco">Endereço Completo</label>
                      <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="numero">Número</label>
                      <input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="setor">Setor</label>
                      <input type="text" id="setor" name="setor" value={formData.setor} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Seção 3: Datas e Horários */}
                <div className="form-section">
                  <h3 className="section-title">Datas e Horários</h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="dataInicio">Data Início</label>
                      <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="horaInicio">Hora Início</label>
                      <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="dataTermino">Data Término</label>
                      <input type="date" id="dataTermino" name="dataTermino" value={formData.dataTermino} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="horaTermino">Hora Término</label>
                      <input type="time" id="horaTermino" name="horaTermino" value={formData.horaTermino} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <h4 className="section-subtitle">Intervalos (opcional)</h4>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="horaIntervaloInicio">Início Intervalo 1</label>
                      <input type="time" id="horaIntervaloInicio" name="horaIntervaloInicio" value={formData.horaIntervaloInicio} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="horaIntervaloTermino">Término Intervalo 1</label>
                      <input type="time" id="horaIntervaloTermino" name="horaIntervaloTermino" value={formData.horaIntervaloTermino} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="horaIntervaloInicio2">Início Intervalo 2</label>
                      <input type="time" id="horaIntervaloInicio2" name="horaIntervaloInicio2" value={formData.horaIntervaloInicio2} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="horaIntervaloTermino2">Término Intervalo 2</label>
                      <input type="time" id="horaIntervaloTermino2" name="horaIntervaloTermino2" value={formData.horaIntervaloTermino2} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="navigation-buttons">
                  <button type="button" className="nav-button prev-button" onClick={handleNextStep}>Próxima Etapa</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-page">
                {/* Seção 4: Tipos de Serviço */}
                <div className="form-section">
                  <h3 className="section-title">Tipos de Serviço (opcional)</h3>
                  <div className="checkbox-grid">
                    <div className="checkbox-group">
                      <input type="checkbox" id="instalacaoDeEquipamentos" name="instalacaoDeEquipamentos" checked={formData.instalacaoDeEquipamentos} onChange={handleChange} />
                      <label htmlFor="instalacaoDeEquipamentos">Instalação de Equipamentos</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="manutencaoDeEquipamentos" name="manutencaoDeEquipamentos" checked={formData.manutencaoDeEquipamentos} onChange={handleChange} />
                      <label htmlFor="manutencaoDeEquipamentos">Manutenção de Equipamentos</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="homologacaoDeInfra" name="homologacaoDeInfra" checked={formData.homologacaoDeInfra} onChange={handleChange} />
                      <label htmlFor="homologacaoDeInfra">Homologação de Infra</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="treinamentoOperacional" name="treinamentoOperacional" checked={formData.treinamentoOperacional} onChange={handleChange} />
                      <label htmlFor="treinamentoOperacional">Treinamento Operacional</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="implantacaoDeSistemas" name="implantacaoDeSistemas" checked={formData.implantacaoDeSistemas} onChange={handleChange} />
                      <label htmlFor="implantacaoDeSistemas">Implantação de Sistemas</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="manutencaoPreventivaContratual" name="manutencaoPreventivaContratual" checked={formData.manutencaoPreventivaContratual} onChange={handleChange} />
                      <label htmlFor="manutencaoPreventivaContratual">Manutenção Preventiva</label>
                    </div>
                  </div>
                </div>

                <div className="navigation-buttons">
                  <button type="button" className="nav-button prev-button" onClick={handlePrevStep}>Etapa Anterior</button>
                  <button type="button" className="nav-button next-button" onClick={handleNextStep}>Próxima Etapa</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-page">
                {/* Seção 5: Equipamentos */}
                <div className="form-section">
                  <h3 className="section-title">Equipamentos (opcional)</h3>
                  <div className="checkbox-grid two-columns">
                    <div className="checkbox-group">
                      <input type="checkbox" id="repprintpoint2" name="repprintpoint2" checked={formData.repprintpoint2} onChange={handleChange} />
                      <label htmlFor="repprintpoint2">REP Print Point2</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="repprintpoint3" name="repprintpoint3" checked={formData.repprintpoint3} onChange={handleChange} />
                      <label htmlFor="repprintpoint3">REP Print Point3</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="repminiprint" name="repminiprint" checked={formData.repminiprint} onChange={handleChange} />
                      <label htmlFor="repminiprint">REP Mini Print</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="repsmart" name="repsmart" checked={formData.repsmart} onChange={handleChange} />
                      <label htmlFor="repsmart">REP Smart</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="relogiomicropoint" name="relogiomicropoint" checked={formData.relogiomicropoint} onChange={handleChange} />
                      <label htmlFor="relogiomicropoint">Relógio Micropoint</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="relogiobiopoint" name="relogiobiopoint" checked={formData.relogiobiopoint} onChange={handleChange} />
                      <label htmlFor="relogiobiopoint">Relógio Biopoint</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="catracamicropoint" name="catracamicropoint" checked={formData.catracamicropoint} onChange={handleChange} />
                      <label htmlFor="catracamicropoint">Catraca Micropoint</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="catracabiopoint" name="catracabiopoint" checked={formData.catracabiopoint} onChange={handleChange} />
                      <label htmlFor="catracabiopoint">Catraca Biopoint</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="catracaceros" name="catracaceros" checked={formData.catracaceros} onChange={handleChange} />
                      <label htmlFor="catracaceros">Catraca Acero</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="catracaidblock" name="catracaidblock" checked={formData.catracaidblock} onChange={handleChange} />
                      <label htmlFor="catracaidblock">Catraca ID Block</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="catracaidnext" name="catracaidnext" checked={formData.catracaidnext} onChange={handleChange} />
                      <label htmlFor="catracaidnext">Catraca ID Next</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="idface" name="idface" checked={formData.idface} onChange={handleChange} />
                      <label htmlFor="idface">ID Face</label>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="idflex" name="idflex" checked={formData.idflex} onChange={handleChange} />
                      <label htmlFor="idflex">ID Flex</label>
                    </div>
                  </div>
                </div>

                {/* Seção 6: Componentes */}
                <div className="form-section">
                  <h3 className="section-title">Componentes (opcional)</h3>
                  <div className="components-grid">
                    {['cabecote', 'leitor', 'fonte', 'impressora'].map((component) => (
                      <div key={component} className="component-item">
                        <input
                          type="checkbox"
                          name={component}
                          checked={formData[component]}
                          onChange={handleChange}
                        />
                        <label>{component.charAt(0).toUpperCase() + component.slice(1)}</label>
                        {formData[component] && (
                          <input
                            type="text"
                            name={`codigo${component.charAt(0).toUpperCase() + component.slice(1)}`}
                            placeholder={`Código (opcional)`}
                            value={formData[`codigo${component.charAt(0).toUpperCase() + component.slice(1)}`]}
                            onChange={handleChange}
                            className="small-input"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seção 7: Informações Adicionais */}
                <div className="form-section">
                  <h3 className="section-title">Informações Adicionais (opcional)</h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="nSerie">Número de Série</label>
                      <input type="text" id="nSerie" name="nSerie" value={formData.nSerie} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="localInstalacao">Local de Instalação</label>
                      <input type="text" id="localInstalacao" name="localInstalacao" value={formData.localInstalacao} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className="input-group full-width">
                    <label htmlFor="observacaoProblemas">Observações sobre Problemas</label>
                    <input type="text" id="observacaoProblemas" name="observacaoProblemas" value={formData.observacaoProblemas} onChange={handleChange} />
                  </div>
                  
                  <div className="input-group full-width">
                    <label htmlFor="observacoes">Observações Gerais</label>
                    <input type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="prestadoraDoServico">Prestadora de Serviço</label>
                    <select id="prestadoraDoServico" name="prestadoraDoServico" value={formData.prestadoraDoServico} onChange={handleChange}>
                      <option value="">Selecione...</option>
                      <option value="Mega Digital">Mega Digital</option>
                      <option value="Metah">Metah</option>
                    </select>
                  </div>
                </div>

                {/* Seção 8: Assinatura */}
                <div className="form-section">
                  <h3 className="section-title">Assinatura (opcional)</h3>
                  <Assinatura 
                    value={formData.assinatura}
                    onChange={handleSignatureChange}
                  />
                </div>

                <div className="navigation-buttons">
                  <button type="button" className="nav-button prev-button" onClick={handlePrevStep}>Etapa Anterior</button>
                  <button type="submit" className="nav-button submit-button" disabled={submitStatus === 'enviando'}>
                  {submitStatus === 'enviando' ? 'Enviando...' : 'Enviar Formulário'}
                </button>
                </div>

                {submitStatus === 'sucesso' && (
                  <div className="success-message">
                    RAC cadastrada com sucesso!
                  </div>
                )}
                {submitStatus === 'erro' && (
                  <div className="error-message">
                    Erro ao enviar RAC. Por favor, tente novamente.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {showEmpresaPopup && (
  <div className="popup-overlay">
    <div className="empresa-popup">
      <h3>Selecione a Empresa</h3>
      <div className="empresa-list">
        {empresasEncontradas.length > 0 ? (
          empresasEncontradas.map((empresa) => (
            <div 
              key={empresa.id} 
              className="empresa-item"
              onClick={() => selecionarEmpresa(empresa)}
            >
              <div className="empresa-nome">{empresa.razaoSocial}</div>
              <div className="empresa-detalhes">
                {empresa.cnpj && <span>CNPJ: {empresa.cnpj}</span>}
                {empresa.cidade && <span>Cidade: {empresa.cidade}</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">Nenhuma empresa encontrada</div>
        )}
      </div>
      <button 
        type="button" 
        className="close-button"
        onClick={() => setShowEmpresaPopup(false)}
      >
        Fechar
      </button>
    </div>
  </div>
)}
      </form>
    </>
  )
}