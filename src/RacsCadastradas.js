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
        horaInicio: '',
        horaTermino: '',
        instalacaoDeEquipamentos: false,
        manutencaoDeEquipamentos: false,
        implantacaoDeSistemas: false,
        manutencaoPreventivaContratual: false,
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
            setor: item.setor,
            horaInicio: item.horaInicio,
            horaTermino: item.horaTermino,
            instalacaoDeEquipamentos:item.instalacaoDeEquipamentos,
            manutencaoDeEquipamentos:item.manutencaoDeEquipamentos,
            implantacaoDeSistemas:item.implantacaoDeSistemas,
            manutencaoPreventivaContratual:item.manutencaoPreventivaContratual,
            repprintpoint:item.repprintpoint,
            repminiprint:item.repminiprint,
            repsmart:item.repsmart,
            relogiomicropoint:item.relogiomicropoint,   
            relogiobiopoint:item.Biopoint,
            catracamicropoint:item.catracamicropoint,
            catracabiopoint:item.catracabiopoint,
            catracaceros:item.catracaceros,
            catracaidblock:item.catracaidblock,
            catracaidnext:item.catracaidnext,
            idface:item.idface,
            idflex:item.idflex,
            nSerie: item.nSerie,
            localinstalacao: item.localinstalacao,
            observacaoproblemas: item.observacaoproblemas,
            componente: item.componente,
            codigocomponente: item.codigocomponente,
            observacoes: item.observacoes,
            
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:3006/racvirtual/edit/${editingItem.id}`, formData);
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
                <label>Data</label>
                
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
                                        <label>Tecnico</label>
                                        <input
                                            type="text"
                                            name="tecnico"
                                            value={formData.tecnico}
                                            onChange={handleInputChange}
                                        />
                                        <label>Razão Social</label>
                                        <input
                                            type="text"
                                            name="razaoSocial"
                                            value={formData.razaoSocial}
                                            onChange={handleInputChange}
                                        />
                                        <label>CNPJ</label>
                                        <input
                                            type="text"
                                            name="cnpj"
                                            value={formData.cnpj}
                                            onChange={handleInputChange}
                                        />
                                        <label>Endereço</label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={formData.endereco}
                                            onChange={handleInputChange}
                                        />
                                        <label>Número</label>
                                        <input
                                            type="text"
                                            name="numero"
                                            value={formData.numero}
                                            onChange={handleInputChange}
                                        />
                                        <label>Cidade</label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={formData.cidade}
                                            onChange={handleInputChange}
                                        />
                                        <label>Responsavel</label>
                                        <input
                                            type="text"
                                            name="responsavel"
                                            value={formData.responsavel}
                                            onChange={handleInputChange}
                                        />
                                        <label>Setor</label>
                                        <input
                                            type="text"
                                            name="setor"
                                            value={formData.setor}
                                            onChange={handleInputChange}
                                        />
                                        <label>Hora de Início</label>
                                        <input
                                            type="text"
                                            name="horaInicio"
                                            value={formData.horaInicio}
                                            onChange={handleInputChange}
                                        />
                                        <label>Hora de Término</label>
                                        <input
                                            type="text"
                                            name="horaTermino"
                                            value={formData.horaTermino}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="checkbox"
                                            name="instalacaoDeEquipamentos"
                                            value={formData.instalacaoDeEquipamentos}
                                            onChange={handleInputChange}
                                        /><label>Instalação de Equipamentos</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="manutencaoDeEquipamentos"
                                            value={formData.manutencaoDeEquipamentos}
                                            onChange={handleInputChange}
                                        /><label>Manutenção de Equipamentos</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="implantacaoDeSistemas"
                                            value={formData.implantacaoDeSistemas}
                                            onChange={handleInputChange}
                                        /><label>Implantação de Sistemas</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="manutencaoPreventivaContratual"
                                            value={formData.manutencaoPreventivaContratual}
                                            onChange={handleInputChange}
                                        /><label>Manutenção Preventiva Contratual</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="repprintpoint"
                                            value={formData.repprintpoint}
                                            onChange={handleInputChange}
                                        /><label>Rep PrintPoint</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="repminiprint"
                                            value={formData.repminiprint}
                                            onChange={handleInputChange}
                                        /><label>Rep MiniPrint</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="repsmart"
                                            value={formData.repsmart}
                                            onChange={handleInputChange}
                                        /><label>Rep Smart</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="relogiomicropoint"
                                            value={formData.relogiomicropoint}
                                            onChange={handleInputChange}
                                        /><label>Relogio Micropoint</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="relogiobiopoint"
                                            value={formData.relogiobiopoint}
                                            onChange={handleInputChange}
                                        /><label>Relogio Biopoint</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="catracamicropoint"
                                            value={formData.catracamicropoint}
                                            onChange={handleInputChange}
                                        /><label>Catraca Micropoint</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="catracabiopoint"
                                            value={formData.catracabiopoint}
                                            onChange={handleInputChange}
                                        /><label>Catraca Biopoint</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="catracaceros"
                                            value={formData.catracaceros}
                                            onChange={handleInputChange}
                                        /><label>Catraca Ceros</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="catracaidblock"
                                            value={formData.catracaidblock}
                                            onChange={handleInputChange}
                                        /><label>Catraca idBlock</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="catracaidnext"
                                            value={formData.catracaidnext}
                                            onChange={handleInputChange}
                                        /><label>Catraca IdNext</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="idface"
                                            value={formData.idface}
                                            onChange={handleInputChange}
                                        /><label>IdFace</label>
                                        
                                        <input
                                            type="checkbox"
                                            name="idflex"
                                            value={formData.idflex}
                                            onChange={handleInputChange}
                                        /><label>IdFlex</label>

                                        <label>Número de Série</label>
                                        <input
                                            type="text"
                                            name="nSerie"
                                            value={formData.nSerie}
                                            onChange={handleInputChange}
                                        />
                                        
                                        <label>Local da Instalação</label>
                                        <input
                                            type="text"
                                            name="localinstalacao"
                                            value={formData.localinstalacao}
                                            onChange={handleInputChange}
                                        />
                                        <label>Observação dos Problemas</label>
                                        <input
                                            type="text"
                                            name="observacaoproblemas"
                                            value={formData.observacaoproblemas}
                                            onChange={handleInputChange}
                                        />
                                        <label>Componente</label>
                                        <input
                                            type="text"
                                            name="componente"
                                            value={formData.componente}
                                            onChange={handleInputChange}
                                        />
                                        <label>Código do Componente</label>
                                        <input
                                            type="text"
                                            name="codigocomponente"
                                            value={formData.codigocomponente}
                                            onChange={handleInputChange}
                                        />
                                        <label>Observações</label>
                                        <input
                                            type="text"
                                            name="observacoes"
                                            value={formData.observacoes}
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
                                        <p><strong>Hora de Início:</strong> {item.horaInicio}</p>
                                        <p><strong>Hora de Término:</strong> {item.horaTermino}</p>
                                        <p><strong>instalacaoDeEquipamentos:</strong> {item.instalacaoDeEquipamentos}</p>
                                        <p><strong>manutencaoDeEquipamentos:</strong> {item.manutencaoDeEquipamentos}</p>
                                        <p><strong>implantacaoDeSistemas  :</strong> {item.implantacaoDeSistemas}</p>
                                        <p><strong>manutencaoPreventivaContratual:</strong> {item.manutencaoPreventivaContratual}</p>
                                        <p><strong>repprintpoint  :</strong> {item.repprintpoint}</p>
                                        <p><strong>repminiprint :</strong> {item.repminiprint}</p>
                                        <p><strong>repsmart :</strong> {item.repsmart}</p>
                                        <p><strong>relogiomicropoint :</strong> {item.relogiomicropoint}</p>
                                        <p><strong>relogiobiopoint :</strong> {item.relogiobiopoint}</p>
                                        <p><strong>atracamicropoint  :</strong> {item.catracamicropoint}</p>
                                        <p><strong>catracabiopoint :</strong> {item.catracabiopoint}</p>
                                        <p><strong>catracaceros :</strong> {item.catracaceros}</p>
                                        <p><strong>catracaidblock :</strong> {item.catracaidblock}</p>
                                        <p><strong>catracaidnext:</strong> {item.catracaidnext}</p>
                                        <p><strong>idface:</strong> {item.idface}</p>
                                        <p><strong>idflex :</strong> {item.idflex}</p>
                                        <p><strong>nSerie :</strong> {item.nSerie}</p>
                                        <p><strong>localinstalacao  :</strong> {item.localinstalacao}</p>
                                        <p><strong>observacaoproblemas:</strong> {item.observacaoproblemas}</p>
                                        <p><strong>componente:</strong> {item.componente}</p>
                                        <p><strong>codigocomponente :</strong> {item.codigocomponente}</p>
                                        <p><strong>observacoes  :</strong> {item.observacoes}</p>
                                        <button onClick={() => gerarPDF(item)}>Gerar PDF</button>
                                        <button onClick={() => handleDelete(item.id)}>Deletar</button>
                                        <button onClick={() => handleEditClick(item.id)}>Editar</button>
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
