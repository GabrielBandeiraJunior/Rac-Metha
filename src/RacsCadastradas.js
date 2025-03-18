import React, { useEffect, useState } from 'react';
 import { jsPDF } from 'jspdf';
 import axios from 'axios';
 import Headers from './Components/Headers';
 import './RacsCadastradas.css';


export default function RacsCadastradas() {
    
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
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
        nSerie: '', localinstalacao: '', observacaoproblemas: '',
        componentes: [], // Inicialize como array vazio
        codigocomponente: [], observacoes: '', prestadoraDoServico: '', assinatura:''
    });
   
    const links = [
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova RAC', url: '/novarac' },
        { label: 'Importar Planilha', url: '/importarplanilha' },
        { label: 'Home', url: '/' }
    ];

    useEffect(() => {
        // Chamada para buscar os dados da API
        axios.get('http://localhost:3000/api/dados')
            .then(response => {
                const dadosFormatados = response.data.map(item => {
                    if (typeof item.componentes === 'string') {
                        try {
                            item.componentes = JSON.parse(item.componentes);
                        } catch (error) {
                            item.componentes = item.componentes.split(',').map(s => s.trim());
                        }
                    }
                    if (item.assinatura) {
                        item.assinatura = item.assinatura;
                    }
                    return item;
                });
                setDados(dadosFormatados);
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

    const filteredDados = dados.filter(item => {
        return (
            (filter.date ? item.date.includes(filter.date) : true) &&
            (filter.tecnico ? item.tecnico.includes(filter.tecnico) : true) &&
            (filter.empresa ? item.razaoSocial.includes(filter.empresa) : true)
        );
    });
    

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData(item); // Preenche o formData com os dados do item selecionado
    };

    // Ao salvar, altere a chave de "assinaturaBase64" para a coluna correta
    const handleSaveEdit = async () => {
        try {
            const payload = { ...formData }
            const booleanFields = [
                'instalacaoDeEquipamentos', 'manutencaoDeEquipamentos', 'homologacaoDeInfra',
                'treinamentoOperacional', 'implantacaoDeSistemas', 'manutencaoPreventivaContratual',
                'repprintpoint2', 'repprintpoint3', 'repminiprint', 'repsmart', 'relogiomicropoint',
                'relogiobiopoint', 'catracamicropoint', 'catracabiopoint', 'catracaceros',
                'catracaidblock', 'catracaidnext', 'idface', 'idflex'
            ]

            if (payload.assinatura && payload.assinatura.startsWith('data:image/png;base64,data:image')) {
                payload.assinatura = payload.assinatura.replace('data:image/png;base64,', '')
            }

            if (typeof payload.codigocomponente === 'object') {
                payload.codigocomponente = JSON.stringify(payload.codigocomponente)
            } else {
                payload.codigocomponente = String(payload.codigocomponente) // Garantir que seja string
            }

            await axios.put(`http://localhost:3000/racvirtual/edit/${editingItem.id}`, payload)
            const response = await axios.get('http://localhost:3000/api/dados')
            setDados(response.data)
            setEditingItem(null)
        } catch (error) {
            console.error("Erro ao editar:", error)
        }
    }

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
            { label: "Número de Série", key: "nSerie" },
            { label: "Local de Instalação", key: "localinstalacao" },
            { label: "Observação dos Problemas", key: "observacaoproblemas" },
            { label: "Componentes", key: "componentes" },
            { label: "Código do Componente", key: "codigocomponente" },
            { label: "Observações", key: "observacoes" },
            { label: "Serviço Prestado Pela:", key: "prestadoraDoServico" },
            { label: "Assinatura:", key: "assinatura" },//CONVERTER PRA IMAGEM
        ]
    
        let yPosition = 5
        doc.text(`RAC Report - ${item.date}`, 1, yPosition)
        yPosition += 5
    
        campos.forEach(campo => {
            const fieldValue = item[campo.key] !== undefined ? item[campo.key] : 'Não disponível'
    
            // Verifica se o valor é booleano e false
            if (typeof fieldValue === 'boolean' && !fieldValue) {
                // Se for falso, não adiciona ao PDF
                return
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

        console.log("Mudando campo:", name, "Novo valor:", value); // Depuração

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

    const renderSignature = (signatureBase64) => {
        if (signatureBase64 && signatureBase64.startsWith('data:image')) {
            return (
                <div>
                    <h2>Assinatura do Cliente</h2>
                    <img 
                        src={signatureBase64} 
                        alt="Assinatura" 
                        style={{ maxWidth: '200px', height: 'auto', border: '1px solid #ccc', padding: '5px' }} 
                    />
                </div>
            );
        } else {
            return <p>Assinatura não disponível</p>;
        }
    };

    const handleComponentChange = (e) => {
        const value = e.target.value;
        setFormData((prevFormData) => {
          const updatedComponents = e.target.checked
            ? [...prevFormData.componentes, value]
            : prevFormData.componentes.filter((item) => item !== value);
      
          return {
            ...prevFormData,
            componentes: updatedComponents,
          };
        });
      };
      
    

    return (
        <div className="pagina-inteira-racscadastradas">
            <header>
                <Headers links={links} />
            </header>
            <h1>RACs Cadastradas</h1>
            <div className="filtros">
                <input type="date" name="date" placeholder="Filtrar por data" onChange={handleFilterChange} />
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
                        //item.COLUNA_BANCO_DADOS
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
                                    <h2>Outras Informações</h2>
                                    <p><strong>Número de Série:</strong> {item.nSerie }</p>
                                    <p><strong>Local de Instalação:</strong> {item.localinstalacao }</p>
                                    <p><strong>Problemas Observados:</strong> {item.observacaoproblemas }</p>

                                    <p><strong>Componentes:</strong></p>

                                    {/* Verifique se `item.componentes` é um array antes de usar `map()` */}
                                    {Array.isArray(item.componentes) && item.componentes.map((componente, index) => (
                                      <p key={index}>{componente}</p>
                                    ))}
                                    
                                    
                                    {/* Verifique se `item.componentes` é um array antes de usar `map()` */}
                                    <p><strong>Códigos dos Componentes:</strong></p>
                                    {Array.isArray(item.componentes) && item.componentes.map((componente, index) => (
                                      <p key={index}>
                                        {componente}: {item.codigocomponente[componente]}
                                      </p>
                                    ))}


                                    <p><strong>Observações:</strong> {item.observacoes }</p>
                                    <p><strong>Serviço Prestado Pela:</strong> {item.prestadoraDoServico }</p>                                 
                                     
                                    {renderSignature(item.assinatura)}

                                
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

                           {/* <label>Componentes:</label>
                            <select
                                name="COMPONENTES"
                                value={formData.componentes || ""}
                                onChange={handleInputChange}
                                
                            >
                                <option value="">SELECIONE COMPONENTES</option>
                                <option value="impressora">impressora</option>
                                <option value="cabecote">cabecote</option>
                                <option value="fonte"> Fonte</option>
                            </select>

                           <label>Código do Componente:</label>
                           <input type="text" name="codigocomponente" value={formData.codigocomponente} onChange={handleInputChange} /> */}

                            <label htmlFor="componentes">Componentes</label>
                            <div>
                            <label>
                                <input
                                type="checkbox"
                                value="impressora"
                                checked={formData.componentes.includes('impressora')}
                                onChange={handleComponentChange}
                                />
                                Impressora
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                value="cabecote"
                                checked={formData.componentes.includes('cabecote')}
                                onChange={handleComponentChange}
                                />
                                Cabecote
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                value="fonte"
                                checked={formData.componentes.includes('fonte')}
                                onChange={handleComponentChange}
                                />
                                Fonte
                            </label>
                            </div>

                            {/* Para cada componente selecionado, renderiza um campo de código */}
                            {formData.componentes.map((componente) => (
                            <div key={componente}>
                                <label htmlFor={`codigo-${componente}`}>Código do {componente}</label>
                                <input
                        type="text"
                        name="codigocomponente"
                        value={formData.codigocomponente}
                        onChange={handleInputChange} // Usando a função correta
                        placeholder="Código do Componente"
                    />
                            </div>
                        ))}

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
