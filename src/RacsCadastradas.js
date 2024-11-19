import React, { useEffect, useState } from 'react';
import './RacsCadastradas.css';
import { jsPDF } from 'jspdf';
import Headers from './Components/Headers';
import axios from 'axios';
import './EditarRac.js';

export default function RacsCadastradas() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ date: '', tecnico: '', empresa: '' });
    const [editingItem, setEditingItem] = useState(null);  // Para armazenar o item sendo editado
    const [formData, setFormData] = useState({
        date: '',
        tecnico: '',
        razaoSocial: '',
        cnpj: '',
        endereco: '',
        numero: '',
        cidade: '',
        responsavel: '',
        setor: '',
        
    });

    const links = [
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova RAC', url: '/rac' },
        { label: 'Home', url: '/' }
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:3004/api/dados');
                setDados(response.data);
            } catch (error) {
                setError('Erro ao buscar dados.');
            }
        }
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const filteredDados = dados.filter(item => {
        return (
            (filter.date === '' || item.date.includes(filter.date)) &&
            (filter.tecnico === '' || item.tecnico.toLowerCase().includes(filter.tecnico.toLowerCase())) &&
            (filter.empresa === '' || item.razaoSocial.toLowerCase().includes(filter.empresa.toLowerCase()))
        );
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const gerarPDF = (item) => {
        const doc = new jsPDF();
        const yOffset = 10;

        doc.text(`Data de Registro: ${formatDate(item.date)}`, 10, yOffset);
        doc.text(`Técnico: ${item.tecnico}`, 10, yOffset + 10);
        doc.text(`Razão Social: ${item.razaoSocial}`, 10, yOffset + 20);
        doc.text(`CNPJ: ${item.cnpj}`, 10, yOffset + 30);
        doc.text(`Endereço: ${item.endereco}, ${item.numero}`, 10, yOffset + 40);
        doc.text(`Número: ${item.numero}`, 10, yOffset + 50);
        doc.text(`Cidade: ${item.cidade}`, 10, yOffset + 60);
        doc.text(`Responsável: ${item.responsavel}`, 10, yOffset + 70);
        doc.text(`Setor: ${item.setor}`, 10, yOffset + 80);

        const servicos = [
            { label: 'Instalação de Equipamentos', value: item.instalacaoDeEquipamentos },
            { label: 'Manutenção de Equipamentos', value: item.manutencaoDeEquipamentos },
            { label: 'Homologação de Infra', value: item.homologacaoDeInfra },
            { label: 'Treinamento Operacional', value: item.treinamentoOperacional },
            { label: 'Implantação de Sistemas', value: item.implantacaoDeSistemas },
            { label: 'Manutenção Preventiva Contratual', value: item.manutencaoPreventivaContratual },
            { label: 'Rep Print Point', value: item.repprintpoint },
            { label: 'Rep Mini Print', value: item.repminiprint },
            { label: 'Rep Smart', value: item.repsmart },
            { label: 'Relógio Micro Point', value: item.relogiomicropoint },
            { label: 'Relógio Bio Point', value: item.relogiobiopoint },
            { label: 'ID Face', value: item.idface },
            { label: 'ID Flex', value: item.idflex },
            { label: 'Catraca Micro Point', value: item.catracamicropoint },
            { label: 'Catraca Bio Point', value: item.catracabiopoint }
        ];

        let currentY = yOffset + 90;

        servicos.forEach(servico => {
            if (servico.value) {
                doc.text(`${servico.label}: Sim`, 10, currentY);
                currentY += 10;
            }
        });

        doc.text(`Nº Série: ${item.nserie}`, 10, currentY);
        currentY += 10;
        doc.text(`Local de Instalação: ${item.localinstalacao}`, 10, currentY);
        currentY += 10;
        doc.text(`Observações de Problemas: ${item.observacaoproblemas}`, 10, currentY);
        currentY += 10;
        doc.text(`Componente: ${item.componente}`, 10, currentY);
        currentY += 10;
        doc.text(`Código do Componente: ${item.codigocomponente}`, 10, currentY);
        currentY += 10;
        doc.text(`Observações: ${item.observacoes}`, 10, currentY);

        doc.save(`RAC_${item.tecnico}.pdf`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3004/racvirtual/delete/${id}`);
            setDados(dados.filter(item => item.id !== id));
            console.log("Registro deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar registro:", error);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item); // Definindo o item sendo editado
        setFormData({
            date: item.date,
            tecnico: item.tecnico,
            razaoSocial: item.razaoSocial,
            cnpj: item.cnpj,
            endereco: item.endereco,
            numero: item.numero,
            cidade: item.cidade,
            responsavel: item.responsavel,
            setor: item.setor
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:3004/racvirtual/edit/${editingItem.id}`, formData);
            console.log("Dados atualizados com sucesso:", response.data);
            setDados(dados.map(item => item.id === editingItem.id ? { ...item, ...formData } : item)); // Atualizando os dados na UI
            setEditingItem(null); // Fechar o modo de edição
        } catch (error) {
            console.error("Erro ao editar RAC:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Headers links={links} />
            <h1>Dados do MySQL</h1>
            <div>
                <input
                    type="date"
                    name="date"
                    placeholder="Data"
                    value={filter.date}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="tecnico"
                    placeholder="Técnico"
                    value={filter.tecnico}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="empresa"
                    placeholder="Empresa"
                    value={filter.empresa}
                    onChange={handleFilterChange}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div id="result">
                {filteredDados.length > 0 ? (
                    filteredDados.map(item => (
                        <div key={item.id}>
                            <div className="result-item">
                                {editingItem && editingItem.id === item.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="tecnico"
                                            value={formData.tecnico}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="razaoSocial"
                                            value={formData.razaoSocial}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="cnpj"
                                            value={formData.cnpj}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={formData.endereco}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="numero"
                                            value={formData.numero}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={formData.cidade}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="responsavel"
                                            value={formData.responsavel}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="setor"
                                            value={formData.setor}
                                            onChange={handleInputChange}
                                        />
                                        <button onClick={handleSaveEdit}>Salvar</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Técnico:</strong> {item.tecnico}</p>
                                        <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
                                        <p><strong>CNPJ:</strong> {item.cnpj}</p>
                                        <p><strong>Endereço:</strong> {item.endereco}</p>
                                        <p><strong>Número:</strong> {item.numero}</p>
                                        <p><strong>Cidade:</strong> {item.cidade}</p>
                                        <p><strong>Responsável:</strong> {item.responsavel}</p>
                                        <p><strong>Setor:</strong> {item.setor}</p>
                                        <button onClick={() => gerarPDF(item)}>Gerar PDF</button>
                                        <button onClick={() => handleDelete(item.id)}>Deletar</button>
                                        <button onClick={() => handleEditClick(item)}>Editar</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>
        </>
    );
}
