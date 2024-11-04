import React, { useEffect, useState } from 'react';
import './RacsCadastradas.css';
import { jsPDF } from 'jspdf';
import Headers from './Components/Headers'
import axios from 'axios';


export default function RacsCadastradas() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await fetch('http://localhost:3004/api/dados');
                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados');
                }
                const data = await response.json();
                console.log(data); // Verifique a estrutura dos dados aqui
                setDados(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDados();
    }, []);

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

    const [filter, setFilter] = useState({ date: '', tecnico: '', empresa: '' });

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

    const gerarPDF = (item) => {
        const doc = new jsPDF();
        const yOffset = 10; // Espaçamento vertical inicial
    
        doc.text(`Data de Registro: ${formatDate(item.date)}`, 10, yOffset);
        doc.text(`Técnico: ${item.tecnico}`, 10, yOffset + 10);
        doc.text(`Razão Social: ${item.razaoSocial}`, 10, yOffset + 20);
        doc.text(`CNPJ: ${item.cnpj}`, 10, yOffset + 30);
        doc.text(`Endereço: ${item.endereco}, ${item.numero}`, 10, yOffset + 40);
        doc.text(`Número: ${item.numero}`, 10, yOffset + 50);
        doc.text(`Cidade: ${item.cidade}`, 10, yOffset + 60);
        doc.text(`Responsável: ${item.cidade}`, 10, yOffset + 70);
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
            { label: 'ID Face', value: item.catracabiopoint },
            { label: 'ID Flex', value: item.catracabiopoint },
            { label: 'Catraca Micro Point', value: item.catracamicropoint },
            { label: 'Catraca Bio Point', value: item.catracabiopoint },
            { label: 'Catraca Ceros', value: item.catracabiopoint },
            { label: 'Catraca ID Block', value: item.catracabiopoint },
            { label: 'Catraca ID Next', value: item.catracabiopoint },
            
        ];
    
        let currentY = yOffset + 90; // Ajuste para onde os serviços começam
    
        servicos.forEach(servico => {
            if (servico.value) {
                doc.text(`${servico.label}: Sim`, 10, currentY);
                currentY += 10; // Espaçamento entre serviços
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
    const links = [
        { label: 'Meu Perfil', url: '/perfil' },
        { label: 'Nova rac', url: '/rac' },
        { label: 'Home', url: '/'} 

      ]


      ///////////////////////////
     
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:3004/api/dados');
      setDados(response.data);
    }
    fetchData();
  }, []);

  // Função para deletar um registro pelo ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/racvirtual/delete/${id}`);
      setDados(dados.filter(item => item.id !== id)); // Atualiza lista após exclusão
      console.log("Registro deletado com sucesso");
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
    }
  };


        

    return (
        <>
        <Headers links={links}/>
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
                                <p><strong>Responsável:</strong> {item.cidade}</p>
                                <p><strong>Setor:</strong> {item.setor}</p>   
                                {/* Condições omitidas para brevidade */}
                                {item.instalacaoDeEquipamentos && <p><strong>Instalação de Equipamentos</strong></p>}
                                {item.manutencaoDeEquipamentos && <p><strong>Manutenção de Equipamentos </strong></p>}
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
                                {item.catracamicropoint && <p><strong>Catraca Micro Point</strong></p>}
                                {item.catracabiopoint && <p><strong>Catraca Bio Point</strong></p>}
                                {item.suporteTi && <p><strong>Suporte TI</strong></p>}
                            </div>
                            
                            <div className='listaitens'>
                                <p><strong>Nº Série:</strong> {item.nserie}</p>
                                <p><strong>localinstalacao:</strong> {item.localinstalacao}</p>
                                <p><strong>observacaoproblemas:</strong> {item.observacaoproblemas}</p>
                                <p><strong>componente:</strong> {item.componente}</p>
                                <p><strong>codigocomponente:</strong> {item.codigocomponente}</p>
                               
                                <p><strong>observacoes:</strong> {item.observacoes}</p>
                                
                                <button onClick={() => gerarPDF(item)}>Gerar PDF</button>

                                <button onClick={() => handleDelete(item.id)}>Excluir</button>
                  
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
