import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import Headers from './Components/Headers'
import './RacsCadastradas.css'

export default function RacsCadastradas() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ date: '', tecnico: '', empresa: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [expandedId, setExpandedId] = useState(null); // Para expandir detalhes
    const [formData, setFormData] = useState({
        date: '', tecnico: '', razaoSocial: '', cnpj: '', endereco: '', numero: '',
        cidade: '', responsavel: '', setor: '', horaInicio: '', horaTermino: '',
        instalacaoDeEquipamentos: false, manutencaoDeEquipamentos: false,
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
    
    const links = [
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova RAC', url: '/novarac' },
        { label: 'Home', url: '/' }
    ];

    useEffect(() => {
        axios.get('http://localhost:3005/api/rac')
            .then(response => setDados(response.data))
            .catch(error => setError('Erro ao buscar dados.'));
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const filteredDados = dados.filter(item =>
        (filter.date === '' || item.date.includes(filter.date)) &&
        (filter.tecnico === '' || item.tecnico.toLowerCase().includes(filter.tecnico.toLowerCase())) &&
        (filter.empresa === '' || item.razaoSocial.toLowerCase().includes(filter.empresa.toLowerCase()))
    );

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData(item); // Carrega os dados do item para edição
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:3006/racvirtual/edit/${editingItem.id}`, formData);
            setDados(dados.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
            setEditingItem(null);
        } catch (error) {
            console.error("Erro ao editar:", error);
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3005/racvirtual/delete/${id}`);
            setDados(dados.filter(item => item.id !== id));
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const gerarPDF = (item) => {
        const doc = new jsPDF();
    
        // Defina as chaves dos campos a serem adicionados ao PDF
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
            { label: "Hora de Início", key: "horaInicio" },
            { label: "Hora de Término", key: "horaTermino" },
            { label: "Instalação de Equipamentos", key: "instalacaoDeEquipamentos" },
            { label: "Manutenção de Equipamentos", key: "manutencaoDeEquipamentos" },
            { label: "Instalação Preventiva Contratual", key: "manutencaoPreventivaContratual" },
            { label: "REP Print Point", key: "repprintpoint" },
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
            { label: "Componente", key: "componente" },
            { label: "Código do Componente", key: "codigocomponente" },
            { label: "Observações", key: "observacoes" }
        ];
            
        let yPosition = 5 // Posição inicial para o texto no PDF
        doc.text(`RAC Report - ${item.date}`, 1, yPosition);
        yPosition += 5; // Espaço entre o título e o primeiro campo
        
        // Percorrer o array de campos e adicionar cada um ao PDF
        campos.forEach(campo => {
            const fieldValue = item[campo.key] !== undefined ? item[campo.key] : 'Não disponível';
            doc.text(`${campo.label}: ${fieldValue}`, 7, yPosition);
            yPosition += 7; // Adiciona um espaçamento entre os campos
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

    return (
        <div pagina-inteira-racscadastradas >
            <header>
                <Headers links={links} />
            </header>
            <h1>RACs Cadastradas</h1>
            <div className="filtros">
                <input type="datetime-local" name="date" placeholder="Filtrar por data" onChange={handleFilterChange} />
                <input type="text" name="tecnico" placeholder="Filtrar por técnico" onChange={handleFilterChange} />
                <input type="text" name="empresa" placeholder="Filtrar por empresa" onChange={handleFilterChange} />
            </div>

            <div className="rac-escondida">
                {filteredDados.map(item => (
                    <div key={item.id} className="dados-item">
                        <p><strong>Técnico:</strong> {item.tecnico}</p>
                        <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
                        <p><strong>Data de Registro:</strong>{item.date}</p>
                        
                        <button onClick={() => toggleExpand(item.id)}>
                            {expandedId === item.id ? 'Esconder Detalhes' : 'Expandir Detalhes'}
                        </button>
                        {expandedId === item.id && (
                            <div className="rac-expandida">
                               {/* <p><strong>Técnico:</strong> {item.tecnico}</p>
                                <p><strong>Razão Social:</strong> {item.razaoSocial}</p> */}
                                <p><strong>CNPJ:</strong> {item.cnpj}</p>
                                <p><strong>Endereço:</strong> {item.endereco}</p>
                                <p><strong>Número:</strong> {item.numero}</p>
                                <p><strong>Responsável:</strong> {item.responsavel}</p>
                                <p><strong>Setor:</strong> {item.setor}</p>
                                <p><strong>Cidade:</strong> {item.cidade}</p>
                                <p><strong>Hora de Início:</strong> {item.horaInicio}</p>
                                <p><strong>Hora de Término:</strong> {item.horaTermino}</p>
                                <p><strong>Instalação de Equipamentos:</strong> {item.instalacaoDeEquipamentos ? 'Sim' : 'Não'}</p>
                                <p><strong>Manutenção de Equipamentos:</strong> {item.manutencaoDeEquipamentos ? 'Sim' : 'Não'}</p>
                                <p><strong>Homologação De Infra:</strong> {item.homologacaodeinfra ? 'Sim' : 'Não'}</p>H
                                <p><strong>Implantação de Sistemas:</strong> {item.implantacaoDeSistemas ? 'Sim' : 'Não'}</p>
                                <p><strong>Manutenção Preventiva Contratual:</strong> {item.manutencaoPreventivaContratual ? 'Sim' : 'Não'}</p>
                                <p><strong>REP Print Point:</strong> {item.repprintpoint ? 'Sim' : 'Não'}</p>
                                <p><strong>REP Mini Print:</strong> {item.repminiprint ? 'Sim' : 'Não'}</p>
                                <p><strong>REP Smart:</strong> {item.repsmart ? 'Sim' : 'Não'}</p>
                                <p><strong>Relógio Micro Point:</strong> {item.relogiomicropoint ? 'Sim' : 'Não'}</p>
                                <p><strong>Relógio Bio Point:</strong> {item.relogiobiopoint ? 'Sim' : 'Não'}</p>
                                <p><strong>Catraca Micro Point:</strong> {item.catracamicropoint ? 'Sim' : 'Não'}</p>
                                <p><strong>Catraca Bio Point:</strong> {item.catracabiopoint ? 'Sim' : 'Não'}</p>
                                <p><strong>Catraca Ceros:</strong> {item.catracaceros ? 'Sim' : 'Não'}</p>
                                <p><strong>Catraca ID Block:</strong> {item.catracaidblock ? 'Sim' : 'Não'}</p>
                                <p><strong>Catraca ID Next:</strong> {item.catracaidnext ? 'Sim' : 'Não'}</p>
                                <p><strong>ID Face:</strong> {item.idface ? 'Sim' : 'Não'}</p>
                                <p><strong>ID Flex:</strong> {item.idflex ? 'Sim' : 'Não'}</p>
                                <p><strong>Número de Série:</strong> {item.nSerie}</p>
                                <p><strong>Local de Instalação:</strong> {item.localinstalacao}</p>
                                <p><strong>Problemas Observados:</strong> {item.observacaoproblemas}</p>
                                <p><strong>Componente:</strong> {item.componente}</p>
                                <p><strong>Código do Componente:</strong> {item.codigocomponente}</p>
                                <p><strong>Observações:</strong> {item.observacoes}</p>

                                <button onClick={() => handleEditClick(item)}>Editar</button>
                                <button onClick={() => handleDelete(item.id)}>Excluir</button>
                                <button onClick={() => gerarPDF(item)}>Gerar PDF</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

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
                        <label>Hora de Início:</label>
                        <input type="datetime-local" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} />
                        <label>Hora de Término:</label>
                        <input type="datetime-local" name="horaTermino" value={formData.horaTermino} onChange={handleInputChange} />
                        <label>Instalação de Equipamentos:</label>
                        <input type="checkbox" name="instalacaoDeEquipamentos" checked={formData.instalacaoDeEquipamentos} onChange={handleInputChange} />
                        <label>Manutenção de Equipamentos:</label>
                        <input type="checkbox" name="manutencaoDeEquipamentos" checked={formData.manutencaoDeEquipamentos} onChange={handleInputChange} />

                        <input type="checkbox" id="homologacaodeinfra" name="homologacaodeinfra" value={formData.homologacaodeinfra} onChange={handleInputChange} />


                        <label>Instalação Preventiva Contratual:</label>
                        <input type="checkbox" name="manutencaoPreventivaContratual" checked={formData.manutencaoPreventivaContratual} onChange={handleInputChange} />
                        <label>REP Print Point:</label>
                        <input type="checkbox" name="repprintpoint" checked={formData.repprintpoint} onChange={handleInputChange} />
                        <label>REP Mini Print:</label>
                        <input type="checkbox" name="repminiprint" checked={formData.repminiprint} onChange={handleInputChange} />
                        <label>REP Print Point:</label>
                        <input type="checkbox" name="repprintpoint" checked={formData.repprintpoint} onChange={handleInputChange} />
                        <label>REP Mini Print:</label>
                        <input type="checkbox" name="repminiprint" checked={formData.repminiprint} onChange={handleInputChange} />
                        <label>REP Smart:</label>
                        <input type="checkbox" name="repsmart" checked={formData.repsmart} onChange={handleInputChange} />
                        <label>Relogio Micropoint:</label>
                        <input type="checkbox" name="relogiomicropoint" checked={formData.relogiomicropoint} onChange={handleInputChange} />
                        <label>Relogio Biopoint:</label>
                        <input type="checkbox" name="relogiobiopoint" checked={formData.relogiobiopoint} onChange={handleInputChange} />
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
                        <input type="text" name="nSerie" checked={formData.nSerie} onChange={handleInputChange} />
                        <label>local de Instalação:</label>
                        <input type="text" name="localinstalacao" checked={formData.localinstalacao} onChange={handleInputChange} />
                        <label>Observação dos Problemas:</label>
                        <input type="text" name="observacaoproblemas" checked={formData.observacaoproblemas} onChange={handleInputChange} />
                        <label>Componente:</label>
                        <input type="text" name="componente" checked={formData.componente} onChange={handleInputChange} />
                        <label>Código do Componente:</label>
                        <input type="text" name="codigocomponente" checked={formData.codigocomponente} onChange={handleInputChange} />
                        <label>Observações:</label>
                        <input type="text" name="observacoes" checked={formData.observacoes} onChange={handleInputChange} />
                        
                        <button type="submit">Salvar</button>
                    </form>
                </div>
            )}
        </div>
    )
}
