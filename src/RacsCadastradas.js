import React, { useEffect, useState } from 'react';
 import { jsPDF } from 'jspdf';
 import axios from 'axios';
 import Headers from './Components/Headers';
 import './RacsCadastradas.css';

export default function RacsCadastradas() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ date: '', tecnico: '', empresa: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [formData, setFormData] = useState({
        date: '', tecnico: '', razaoSocial: '', cnpj: '', endereco: '', numero: '',
        cidade: '', responsavel: '', setor: '',
        dataInicio: '', horaInicio: '',
        dataTermino: '', horaTermino: '',

        horaIntervaloInicio: '', horaIntervaloTermino: '',
        horaIntervaloInicio2: '', horaIntervaloTermino2: '',
        
        instalacaoDeEquipamentos: false, manutencaoDeEquipamentos: false,
        homologacaoDeInfra: false, treinamentoOperacional: false,
        implantacaoDeSistemas: false, manutencaoPreventivaContratual: false,
        repprintpoint2: false, repprintpoint3: false, repminiprint: false,
        repsmart: false, relogiomicropoint: false, relogiobiopoint: false,
        catracamicropoint: false, catracabiopoint: false, catracaceros: false,
        catracaidblock: false, catracaidnext: false, idface: false, idflex: false,
        impressora: false,
        cabecote: false,
        fonte: false,
        leitor: false,
        nSerie: '', localinstalacao: '', observacaoproblemas: '',
        componentes: '', codigocomponente: '', observacoes: '', prestadoraDoServico: ''
    });
    const [loading, setLoading] = useState(true);

    const links = [
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova RAC', url: '/novarac' },
        { label: 'Importar Planilha', url: '/importarplanilha' },
        { label: 'Home', url: '/' }
    ];

    useEffect(() => {
        axios.get('http://localhost:3000/api/dados')
            .then(response => {
                console.log("Dados recebidos:", response.data); // Verifique os dados
                setDados(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar dados:", error);
                setError('Erro ao buscar dados.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const filteredDados = dados; // Remova os filtros temporariamente para teste

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData(item);
    };

    const handleSaveEdit = async () => {
        try {
          // Envia apenas os campos que foram alterados
          const payload = { ...formData };

        // Remove campos que não foram alterados (opcional, dependendo da lógica do seu formulário)
        // for (const key in payload) {
        //     if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
        //         delete payload[key];
        //     }
        //   }
      
          // Garante que os campos booleanos sejam enviados como true/false
          const booleanFields = [
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
      
          booleanFields.forEach((field) => {
            if (payload[field] === undefined) {
                // Se o campo não foi passado, define explicitamente como false
                payload[field] = false;
            } else if (payload[field] === '' || payload[field] === null) {
                // Garantir que valores vazios ou nulos sejam convertidos para false
                payload[field] = false;
            } else {
                // Se o valor for true, ou um valor booleano '1' ou 'true', mantemos como true
                payload[field] = payload[field] === true || payload[field] === 1 || payload[field] === 'true';
            }
        });

          for (const key in payload) {
            if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
                delete payload[key];
            }
        }
      
          await axios.put(`http://localhost:3000/racvirtual/edit/${editingItem.id}`, payload);
      
          // Atualiza a lista de dados após a edição
          const response = await axios.get('http://localhost:3000/api/dados');
          setDados(response.data);
          setEditingItem(null);
        } catch (error) {
          console.error("Erro ao editar:", error);
        }
      };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/racvirtual/delete/${id}`);
            const response = await axios.get('http://localhost:3000/api/dados');
            setDados(response.data);
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const gerarPDF = (item) => {
        const doc = new jsPDF();
        const campos = [
            { label: "Data de Registro", key: "date" },
            { label: "Técnico", key: "tecnico" },
            { label: "Razão Social", key: "razaoSocial" },
            { label: "CNPJ", key: "cnpj" },
            { label: "Endereço", key: "endereco" },
            { label: "Número", key: "numero" },
            { label: "Cidade", key: "cidade" },
            { label: "Responsável", key: "responsavel" },
            { label: "Setor", key: "setor" },
            { label: "Data de Início", key: "dataInicio" },
            { label: "Hora de Início", key: "horaInicio" },
            { label: "Data de Término", key: "dataTermino" },
            { label: "Hora de Término", key: "horaTermino" },
            { label: "Inicio do Intervalo", key: "horaIntervaloInicio" },
            { label: "Término do Intervalo", key: "horaIntervaloTermino" },
            { label: "Inicio do Segundo Intervalo", key: "horaIntervaloInicio2" },
            { label: "Término do Segundo Intervalo", key: "horaIntervaloTermino2" },
            { label: "Instalação de Equipamentos", key: "instalacaoDeEquipamentos" },
            { label: "Manutenção de Equipamentos", key: "manutencaoDeEquipamentos" },
            { label: "Instalação Preventiva Contratual", key: "manutencaoPreventivaContratual" },
            { label: "REP Print Point 2", key: "repprintpoint2" },
            { label: "REP Print Point 3", key: "repprintpoint3" },
            { label: "REP Mini Print", key: "repminiprint" },
            { label: "REP Smart", key: "repsmart" },
            { label: "Relógio Micropoint", key: "relogiomicropoint" },
            { label: "Relógio Biopoint", key: "relogiobiopoint" },
            { label: "Catraca Ceros", key: "catracaceros" },
            { label: "Catraca Id Block", key: "catracaidblock" },
            { label: "Catraca Id Next", key: "catracaidnext" },
            { label: "Id Face", key: "idface" },
            { label: "Id Flex", key: "idflex" },
            { label: "impressora", key: "impressora" },
            { label: "cabecote", key: "cabecote" },
            { label: "fonte", key: "fonte" },
            { label: "leitor", key: "leitor" },
            { label: "Número de Série", key: "nSerie" },
            { label: "Local de Instalação", key: "localinstalacao" },
            { label: "Observação dos Problemas", key: "observacaoproblemas" },
            { label: "Componentes", key: "componentes" },
            { label: "Código do Componente", key: "codigocomponente" },
            { label: "Observações", key: "observacoes" },
            { label: "Serviço Prestado Pela:", key: "prestadoraDoServico" }
        ];
    
        let yPosition = 5;
        doc.text(`RAC Report - ${item.date}`, 1, yPosition);
        yPosition += 5;
    
        campos.forEach(campo => {
            const fieldValue = item[campo.key] !== undefined ? item[campo.key] : 'Não disponível';
    
            // Verifica se o valor é booleano e false
            if (typeof fieldValue === 'boolean' && !fieldValue) {
                // Se for falso, não adiciona ao PDF
                return;
            }
    
            if (typeof fieldValue === 'boolean' && fieldValue) {
                doc.text(`${campo.label}: Sim`, 7, yPosition);
            } else if (typeof fieldValue !== 'boolean') {
                doc.text(`${campo.label}: ${fieldValue}`, 7, yPosition);
            }
            yPosition += 7;
        });
    
        doc.save(`RAC_${item.date}_${item.tecnico}.pdf`);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Data inválida";
        const date = new Date(dateString);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className="pagina-inteira-racscadastradas">
            <header>
                <Headers links={links} />
            </header>
            <h1>RACs Cadastradas</h1>
            <div className="filtros">
                <input type="datetime-local" name="date" placeholder="Filtrar por data" onChange={handleFilterChange} />
                <input type="text" name="tecnico" placeholder="Filtrar por técnico" onChange={handleFilterChange} />
                <input type="text" name="empresa" placeholder="Filtrar por empresa" onChange={handleFilterChange} />
            </div>
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="rac-escondida">
                    {filteredDados.map(item => (
                        //item.NOME_COLUNA_EXATA_BANCO_DE_DADOS
                        <div key={item.id} className="dados-item">
                            <p><strong>Técnico:</strong> {item.tecnico }</p>
                            <p><strong>Razão Social:</strong> {item.razaoSocial }</p>
                            <p><strong>Data de Registro:</strong> { formatDate(item.date)}</p>
                            <button onClick={() => toggleExpand(item.id)}>
                                {expandedId === item.id ? 'Esconder Detalhes' : 'Expandir Detalhes'}
                            </button>
                            <button onClick={() => handleEditClick(item)}>Editar</button>
                            <button onClick={() => handleDelete(item.id)}>Excluir</button>
                            <button onClick={() => gerarPDF(item)}>Gerar PDF</button>
                            {expandedId === item.id && (
                                <div className="rac-expandida">
                                    <p><strong>CNPJ:</strong> {item.cnpj }</p>
                                    <p><strong>Endereço:</strong> {item.endereco }</p>
                                    <p><strong>Número:</strong> {item.numero }</p>
                                    <p><strong>Responsável:</strong> {item.responsavel }</p>
                                    <p><strong>Setor:</strong> {item.setor }</p>
                                    <p><strong>Cidade:</strong> {item.cidade }</p>
                                    <p><strong>Data de Início:</strong> { formatDate(item.dataInicio) }</p>
                                    <p><strong>Hora de Início:</strong> {item.horaInicio }</p>
                                    <p><strong>Data de Término:</strong> { formatDate(item.dataTermino) }</p>
                                    <p><strong>Hora de Término:</strong> {item.horaTermino }</p>
                                    <h2>Intervalos</h2>
                                    <p><strong>Inicio do Intervalo:</strong> {item.horaIntervaloInicio }</p>
                                    <p><strong>Término do Intervalo:</strong> {item.horaIntervaloTermino }</p>
                                    <p><strong>Inicio do Segundo Intervalo:</strong> {item.horaIntervaloInicio2 }</p>
                                    <p><strong>Término do Segundo Intervalo:</strong> {item.horaIntervaloTermino2 }</p>
                                    <h2>Serviço Prestado</h2>
                                    {item.instalacaoDeEquipamentos && <p><strong>Instalação de Equipamentos</strong></p>}
                                    {item.manutencaoDeEquipamentos && <p><strong>Manutenção de Equipamentos</strong></p>}
                                    {item.homologacaoDeInfra && <p><strong>Homologação De Infra</strong></p>}
                                    {item.treinamentoOperacional && <p><strong>Treinamento Operacional</strong></p>}
                                    {item.implantacaoDeSistemas && <p><strong>Implantação de Sistemas</strong></p>}
                                    {item.manutencaoPreventivaContratual && <p><strong>Manutenção Preventiva Contratual</strong></p>}
                                    <h2>Equipamento</h2>
                                    {item.repprintpoint2 && <p><strong>REP Print Point 2</strong></p>}
                                    {item.repprintpoint3 && <p><strong>REP Print Point 3</strong></p>}
                                    {item.repminiprint && <p><strong>REP Mini Print</strong></p>}
                                    {item.repsmart && <p><strong>REP Smart</strong></p>}
                                    {item.relogiomicropoint && <p><strong>Relógio Micro Point</strong></p>}
                                    {item.relogiobiopoint && <p><strong>Relógio Bio Point</strong></p>}
                                    {item.catracamicropoint && <p><strong>Catraca Micro Point</strong></p>}
                                    {item.catracabiopoint && <p><strong>Catraca Bio Point</strong></p>}
                                    {item.catracaceros && <p><strong>Catraca Ceros</strong></p>}
                                    {item.catracaidblock && <p><strong>Catraca ID Block</strong></p>}
                                    {item.catracaidnext && <p><strong>Catraca ID Next</strong></p>}
                                    {item.idface && <p><strong>ID Face</strong></p>}
                                    {item.idflex && <p><strong>ID Flex</strong></p>}
                                    {item.impressora && <p><strong>Impressora</strong></p>}
                                    <p><strong>Codigo da Impressora:</strong> {item.codigoImpressora }</p>
                                    {item.fonte && <p><strong>Fonte</strong></p>}
                                    <p><strong>Codigo da Fonte:</strong> {item.codigoFonte }</p>
                                    {item.cabecote && <p><strong>Cabecote</strong></p>}
                                    <p><strong>Codigo do Cabecote:</strong> {item.codigoCabecote }</p>
                                    {item.leitor && <p><strong>Leitor</strong></p>}
                                    <p><strong>Codigo do Leitor:</strong> {item.codigoLeitor }</p>

                                    <h2>Outras Informações</h2>
                                    <p><strong>Número de Série:</strong> {item.nSerie }</p>
                                    <p><strong>Local de Instalação:</strong> {item.localinstalacao }</p>
                                    <p><strong>Problemas Observados:</strong> {item.observacaoproblemas }</p>
                                    <p><strong>Componentes:</strong> {item.COMPONENTES }</p>
                                    <p><strong>Código do Componente:</strong> {item.codigocomponente }</p>
                                    <p><strong>Observações:</strong> {item.observacoes }</p>
                                    <p><strong>Serviço Prestado Pela:</strong> {item.prestadoraDoServico }</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {editingItem && (
                <div className="form-editar">
                    <h2>Editar RAC</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                        
                        <label>Técnico:</label>
                        <input type="text" name="tecnico" value={formData.tecnico} onChange={handleInputChange} />
                        <label>Razão Social:</label>
                        <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} />
                        <label>CNPJ:</label>
                        <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} />
                        <label>Endereço:</label>
                        <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} />
                        <label>Número:</label>
                        <input type="text" name="numero" value={formData.numero} onChange={handleInputChange} />
                        <label>Cidade:</label>
                        <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} />
                        <label>Responsável:</label>
                        <input type="text" name="responsavel" value={formData.responsavel} onChange={handleInputChange} />
                        <label>Setor:</label>
                        <input type="text" name="setor" value={formData.setor} onChange={handleInputChange} />
                        <label>Data de Início:</label>
                        <input type="date" name="dataInicio" value={formData.dataInicio} onChange={handleInputChange} />
                        <label>Hora de Início:</label>
                        <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} />
                        <label>Data de Término:</label>
                        <input type="date" name="dataTermino" value={formData.dataTermino} onChange={handleInputChange} />
                        <label>Hora de Término:</label>
                        <input type="time" name="horaTermino" value={formData.horaTermino} onChange={handleInputChange} />
                        <label>Hora de Inicio do Intervalo:</label>
                        <input type="time" name="horaIntervaloInicio" value={formData.horaIntervaloInicio} onChange={handleInputChange} />
                        <label>Hora de Término do Intervalo</label>
                        <input type="time" name="horaIntervaloTermino" value={formData.horaIntervaloTermino} onChange={handleInputChange} />
                        <label>Hora de Inicio do Segundo Intervalo:</label>
                        <input type="time" name="horaIntervaloInicio2" value={formData.horaIntervaloInicio2} onChange={handleInputChange} />
                        <label>Hora de Término do Segundo Intervalo:</label>
                        <input type="time" name="horaIntervaloTermino2" value={formData.horaIntervaloTermino2} onChange={handleInputChange} />
                        <label>Instalação de Equipamentos:</label>
                        <input type="checkbox" name="instalacaoDeEquipamentos" checked={formData.instalacaoDeEquipamentos} onChange={handleInputChange} />
                        <label>Manutenção de Equipamentos:</label>
                        <input type="checkbox" name="manutencaoDeEquipamentos" checked={formData.manutencaoDeEquipamentos} onChange={handleInputChange} />
                        <label>Homolocação de Infra</label>
                        <input type="checkbox" name="homologacaoDeInfra" checked={formData.homologacaoDeInfra} onChange={handleInputChange} />
                        <label>Treinamento operacional</label>
                        <input type="checkbox" name="treinamentoOperacional" checked={formData.treinamentoOperacional} onChange={handleInputChange} />
                        <label>Implantação De Sistemas</label>
                        <input type="checkbox" name="implantacaoDeSistemas" checked={formData.implantacaoDeSistemas} onChange={handleInputChange} />
                        <label>Manutenção Preventiva Contratual:</label>
                        <input type="checkbox" name="manutencaoPreventivaContratual" checked={formData.manutencaoPreventivaContratual} onChange={handleInputChange} />
                        <label>REP Print Point 2:</label>
                        <input type="checkbox" name="repprintpoint2" checked={formData.repprintpoint2} onChange={handleInputChange} />
                        <label>REP Print Point 3:</label>
                        <input type="checkbox" name="repprintpoint3" checked={formData.repprintpoint3} onChange={handleInputChange} />
                        <label>REP Mini Print:</label>
                        <input type="checkbox" name="repminiprint" checked={formData.repminiprint} onChange={handleInputChange} />
                        <label>REP Smart:</label>
                        <input type="checkbox" name="repsmart" checked={formData.repsmart} onChange={handleInputChange} />
                        <label>Relogio Micropoint:</label>
                        <input type="checkbox" name="relogiomicropoint" checked={formData.relogiomicropoint} onChange={handleInputChange} />
                        <label>Relogio Biopoint:</label>
                        <input type="checkbox" name="relogiobiopoint" checked={formData.relogiobiopoint} onChange={handleInputChange} />
                        <label>Catraca Micropoint</label>
                        <input type="checkbox" name="catracamicropoint" checked={formData.catracamicropoint} onChange={handleInputChange} />
                        <label>Catraca Biopoint</label>
                        <input type="checkbox" name="catracabiopoint" checked={formData.catracabiopoint} onChange={handleInputChange} />
                        <label>Catraca Ceros:</label>
                        <input type="checkbox" name="catracaceros" checked={formData.catracaceros} onChange={handleInputChange} />
                        <label>Catraca Id Block:</label>
                        <input type="checkbox" name="catracaidblock" checked={formData.catracaidblock} onChange={handleInputChange} />
                        <label>Catraca Id Next:</label>
                        <input type="checkbox" name="catracaidnext" checked={formData.catracaidnext} onChange={handleInputChange} />
                        <label>Id Face:</label>
                        <input type="checkbox" name="idface" checked={formData.idface} onChange={handleInputChange} />
                        <label>Id Flex:</label>
                        <input type="checkbox" name="idflex" checked={formData.idflex} onChange={handleInputChange} />
                        <label>Número de Série:</label>
                        <input type="text" name="nSerie" value={formData.nSerie} onChange={handleInputChange} />
                        <label>local de Instalação:</label>
                        <input type="text" name="localinstalacao" value={formData.localinstalacao} onChange={handleInputChange} />
                        <label>Observação dos Problemas:</label>
                        <input type="text" name="observacaoproblemas" value={formData.observacaoproblemas} onChange={handleInputChange} />

    <div>
        <strong>Cabecote</strong>
        <input
          type="checkbox"
          name="cabecote"
          checked={formData.cabecote}
          onChange={handleInputChange}
        />
        {formData.cabecote && (
          <input
            type="text"
            name="codigoCabecote"
            placeholder="Código do Cabecote"
            value={formData.codigoCabecote}
            onChange={handleInputChange}
          />
        )}
      </div>

      {/* Checkbox e Input para Leitor */}
      <div>
        <strong>Leitor</strong>
        <input
          type="checkbox"
          name="leitor"
          checked={formData.leitor}
          onChange={handleInputChange}
        />
        {formData.leitor && (
          <input
            type="text"
            name="codigoLeitor"
            placeholder="Código do Leitor"
            value={formData.codigoLeitor}
            onChange={handleInputChange}
          />
        )}
      </div>
      <div>
        <strong>Fonte</strong>
        <input
          type="checkbox"
          name="fonte"
          checked={formData.fonte}
          onChange={handleInputChange}
        />
        {formData.fonte && (
          <input
            type="text"
            name="codigoFonte"
            placeholder="Código da Fonte"
            value={formData.codigoFonte}
            onChange={handleInputChange}
          />
        )}
      </div>
      <div>
        <strong>Impressora</strong>
        <input
          type="checkbox"
          name="impressora"
          checked={formData.impressora}
          onChange={handleInputChange}
        />
        {formData.impressora && (
          <input
            type="text"
            name="codigoImpressora"
            placeholder="Código da Impressora"
            value={formData.codigoImpressora}
            onChange={handleInputChange}
          />
        )}
    </div>

                        <label>Observações:</label>
                        <input type="text" name="observacoes" value={formData.observacoes} onChange={handleInputChange} />
                        <label>Serviço Prestado Pela:</label>
                        <select
                            name="prestadoraDoServico"
                            value={formData.prestadoraDoServico}
                            onChange={handleInputChange}
                            
                        >
                            <option value="">Selecione uma prestadora</option>
                            <option value="Mega Digital Equipamentos">Mega Digital Equipamentos - CNPJ: 21.922.053/0001-30</option>
                            <option value="Meta Comércio e Serviço">Meta Comércio e Serviço - CNPJ: 14.617.197/0001-17</option>
                        </select>
                        <button type="submit">Salvar</button>
                    </form>
                </div>
            )}
        </div>
    );
}
