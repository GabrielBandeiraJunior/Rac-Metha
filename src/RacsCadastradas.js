import React, { useEffect, useState } from 'react';
import './RacsCadastradas.css';
import { jsPDF } from 'jspdf';
import Headers from './Components/Headers'
import axios from 'axios';

export default function RacsCadastradas() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ date: '', tecnico: '', empresa: '' });

    // Links para o componente Headers
    const links = [
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova RAC', url: '/rac' },
        { label: 'Home', url: '/' }
    ];

    // Buscar dados do servidor
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

    // Função para filtrar dados
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

    // Função para formatar data
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

    // Função para gerar PDF
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

    // Função para deletar um registro
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3004/racvirtual/delete/${id}`);
            setDados(dados.filter(item => item.id !== id));
            console.log("Registro deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar registro:", error);
        }
    };

    // Função para editar um registro (Exemplo básico)
    const editarRac = async (id, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:3005/racvirtual/edit/${id}`, updatedData);
            const updatedRac = response.data;
            setDados(dados.map(item => item.id === id ? updatedRac : item));
            console.log("Registro atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao editar registro:", error);
        }
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
                    filteredDados.map((item) => (
                        <div className="container" key={item.id}>
                            <div className="listaitens">
                                <p><strong>Data de Registro:</strong> {formatDate(item.date)}</p>
                                <h2>{item.tecnico}</h2>
                                <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
                                <p><strong>CNPJ:</strong> {item.cnpj}</p>
                                <p><strong>Endereço:</strong> {item.endereco}, {item.numero}</p>
                                <p><strong>Número:</strong> {item.numero}</p>
                                <p><strong>Cidade:</strong> {item.cidade}</p>
                                <p><strong>Responsável:</strong> {item.responsavel}</p>
                                <p><strong>Setor:</strong> {item.setor}</p>

                                {/* Serviços */}
                                {item.instalacaoDeEquipamentos && <p><strong>Instalação de Equipamentos</strong></p>}
                                {item.manutencaoDeEquipamentos && <p><strong>Manutenção de Equipamentos</strong></p>}
                                {item.customizacao && <p><strong>Customização</strong></p>}
                                {item.diagnosticoDeProjetos && <p><strong>Diagnóstico de Projetos</strong></p>}
                                {item.homologacaoDeInfra && <p><strong>Homologação de Infra</strong></p>}
                                {item.deslocamento && <p><strong>Deslocamento</strong></p>}
                                {item.treinamentoOperacional && <p><strong>Treinamento Operacional</strong></p>}
                                {item.implantacaoDeSistemas && <p><strong>Implantação de Sistemas</strong></p>}
                                {item.manutencaoPreventivaContratual && <p><strong>Manutenção Preventiva Contratual</strong></p>}
                                {item.repprintpoint && <p><strong>Rep Print Point</strong></p>}
                                {item.repminiprint && <p><strong>Rep Mini Print</strong></p>}
                                {item.repsmart && <p><strong>Rep Smart</strong></p>}
                                {item.relogiomicropoint && <p><strong>Relógio Micro Point</strong></p>}
                                {item.relogiobiopoint && <p><strong>Relógio Bio Point</strong></p>}
                                {item.catracabiopoint && <p><strong>Catraca Bio Point</strong></p>}
                                {item.catracamicropoint && <p><strong>Catraca Micro Point</strong></p>}
                                {item.catracabiopoint && <p><strong>Catraca Bio Point</strong></p>}

                                <div className="actions">
                                    <button onClick={() => gerarPDF(item)}>Gerar PDF</button>
                                    <button onClick={() => handleDelete(item.id)}>Deletar</button>
                                    <button onClick={() => editarRac(item.id, { ...item, tecnico: "Novo Técnico" })}>Editar</button>
                                </div>
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
