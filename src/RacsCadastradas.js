import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import './RacsCadastradas.css';
import Headers from './Components/Headers'

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
            await axios.put(`http://localhost:3005/racvirtual/edit/${editingItem.id}`, formData);
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
        doc.text(`Técnico: ${item.tecnico}`, 10, 10);
        // Adicione outros campos ao PDF
        doc.save(`RAC_${item.tecnico}.pdf`);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="racs-container">
            <header>
                <Headers links={links} />
            </header>
            <h1>RACs Cadastradas</h1>
            <div className="filters">
                <input type="text" name="date" placeholder="Filtrar por data" onChange={handleFilterChange} />
                <input type="text" name="tecnico" placeholder="Filtrar por técnico" onChange={handleFilterChange} />
                <input type="text" name="empresa" placeholder="Filtrar por empresa" onChange={handleFilterChange} />
            </div>

            <div className="dados-list">
                {filteredDados.map(item => (
                    <div key={item.id} className="dados-item">
                        <p><strong>Técnico:</strong> {item.tecnico}</p>
                        <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
                        <p><strong>Data de Registro:</strong>{item.date}</p>
                        
                        <button onClick={() => toggleExpand(item.id)}>
                            {expandedId === item.id ? 'Esconder Detalhes' : 'Expandir Detalhes'}
                        </button>
                        {expandedId === item.id && (
                            <div className="details">
                               <p><strong>Técnico:</strong> {item.tecnico}</p>
                                <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
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
                <div className="edit-form">
                    <h2>Editar RAC</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                        <input type="text" name="date" value={formData.date} onChange={handleInputChange} />
                        <input type="text" name="tecnico" value={formData.tecnico} onChange={handleInputChange} />
                        <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} />
                        <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} />
                        <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} />
                        <input type="text" name="numero" value={formData.numero} onChange={handleInputChange} />
                        <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} />
                        <input type="text" name="responsavel" value={formData.responsavel} onChange={handleInputChange} />
                        <input type="text" name="setor" value={formData.setor} onChange={handleInputChange} />
                        <input type="text" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} />
                        <input type="text" name="horaTermino" value={formData.horaTermino} onChange={handleInputChange} />
                        <input type="checkbox" name="instalacaoDeEquipamentos" checked={formData.instalacaoDeEquipamentos} onChange={handleInputChange} />
                        <input type="checkbox" name="manutencaoDeEquipamentos" checked={formData.manutencaoDeEquipamentos} onChange={handleInputChange} />
                        <input type="checkbox" name="manutencaoPreventivaContratual" checked={formData.manutencaoPreventivaContratual} onChange={handleInputChange} />
                        <input type="checkbox" name="repprintpoint" checked={formData.repprintpoint} onChange={handleInputChange} />
                        <input type="checkbox" name="repminiprint" checked={formData.repminiprint} onChange={handleInputChange} />
                        <input type="checkbox" name="repprintpoint" checked={formData.repprintpoint} onChange={handleInputChange} />
                        <input type="checkbox" name="repminiprint" checked={formData.repminiprint} onChange={handleInputChange} />
                        <input type="checkbox" name="repsmart" checked={formData.repsmart} onChange={handleInputChange} />
                        <input type="checkbox" name="relogiomicropoint" checked={formData.relogiomicropoint} onChange={handleInputChange} />
                        <input type="checkbox" name="relogiobiopoint" checked={formData.relogiobiopoint} onChange={handleInputChange} />
                        <input type="checkbox" name="catracamicropoint" checked={formData.catracamicropoint} onChange={handleInputChange} />
                        <input type="checkbox" name="catracabiopoint" checked={formData.catracabiopoint} onChange={handleInputChange} />
                        <input type="checkbox" name="catracaceros" checked={formData.catracaceros} onChange={handleInputChange} />
                        <input type="checkbox" name="catracaidblock" checked={formData.catracaidblock} onChange={handleInputChange} />
                        <input type="checkbox" name="catracaidnext" checked={formData.catracaidnext} onChange={handleInputChange} />
                        <input type="checkbox" name="idface" checked={formData.idface} onChange={handleInputChange} />
                        <input type="checkbox" name="idflex" checked={formData.idflex} onChange={handleInputChange} />
                        <input type="text" name="nSerie" checked={formData.nSerie} onChange={handleInputChange} />
                        <input type="text" name="localinstalacao" checked={formData.localinstalacao} onChange={handleInputChange} />
                        <input type="text" name="observacaoproblemas" checked={formData.observacaoproblemas} onChange={handleInputChange} />
                        <input type="text" name="componente" checked={formData.componente} onChange={handleInputChange} />
                        <input type="text" name="codigocomponente" checked={formData.codigocomponente} onChange={handleInputChange} />
                        <input type="text" name="observacoes" checked={formData.observacoes} onChange={handleInputChange} />
                        <button type="submit">Salvar</button>
                    </form>
                </div>
            )}
        </div>
    )
}
