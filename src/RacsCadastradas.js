import React, { useEffect, useState } from 'react';
import './RacsCadastradas.css'; // Opcional, para estilização
import {Link} from 'react-router-dom'

export default function RacsCadastradas() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await fetch('http://localhost:3003/api/dados'); // Verifique a porta
                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados');
                }
                const data = await response.json();
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

    return (
        <>
            <h1>Dados do MySQL</h1>
            

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div id="result">
                {dados.length > 0 ? (
                    dados.map((item) => (
                        <div className="container" key={item.id}>
                            <div ClassName="listaitens">
                            <p><strong>Data de Registro:</strong> {formatDate(item.date)}</p>
                            <h2>{item.tecnico}</h2>
                            <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
                            <p><strong>CNPJ:</strong> {item.cnpj}</p>
                            <p><strong>Endereço:</strong> {item.endereco}, {item.numero}</p>
                            <p><strong>Número:</strong> {item.numero}</p>
                            <p><strong>Cidade:</strong> {item.cidade}</p>                                                        
                            <p><strong>Responsável:</strong> {item.cidade}</p>
                            <p><strong>Setor:</strong> {item.setor}</p>   

                            {item.instalacaoDeEquipamentos && <p><strong>Instalação de Equipamentos: Sim</strong></p>}
                            {item.manutencaoDeEquipamentos && <p><strong>Manutenção de Equipamentos: Sim</strong></p>}
                            {item.customizacao && <p><strong>Customização: Sim</strong></p>}
                            {item.diagnosticoDeProjetos && <p><strong>Diagnóstico de Projetos: Sim</strong></p>}
                            {item.homologacaoDeInfra && <p><strong>Homologação de Infra: Sim</strong></p>}
                            {item.deslocamento && <p><strong>Deslocamento: Sim</strong></p>}
                            {item.treinamentoOperacional && <p><strong>Treinamento Operacional: Sim</strong></p>}
                            {item.implantacaoDeSistemas && <p><strong>Implantação de Sistemas: Sim</strong></p>}
                            {item.manutencaoPreventivaContratual && <p><strong>Manutenção Preventiva Contratual: Sim</strong></p>}
                            {item.repprintpoint && <p><strong>Rep Print Point: Sim</strong></p>}
                            {item.repminiprint && <p><strong>Rep Mini Print: Sim</strong></p>}
                            {item.repsmart && <p><strong>Rep Smart: Sim</strong></p>}
                            {item.relogiomicropoint && <p><strong>Relógio Micro Point: Sim</strong></p>}
                            {item.relogiobiopoint && <p><strong>Relógio Bio Point: Sim</strong></p>}
                            {item.catracamicropoint && <p><strong>Catraca Micro Point: Sim</strong></p>}
                            {item.catracabiopoint && <p><strong>Catraca Bio Point: Sim</strong></p>}
                            {item.suporteTi && <p><strong>Suporte TI: Sim</strong></p>} 
                            </div>
                        <div className='listaitens'>
                            <p><strong>Nº Série:</strong> {item.nserie}</p>
                            <p><strong>localinstalacao:</strong> {item.localinstalacao}</p>
                            <p><strong>observacaoproblemas:</strong> {item.observacaoproblemas}</p>
                            <p><strong>componente:</strong> {item.componente}</p>
                            <p><strong>codigocomponente:</strong> {item.codigocomponente}</p>
                            <p><strong>valorvisita:</strong> {item.valorvisita}</p>
                            <p><strong>valorrs:</strong> {item.valorrs}</p>
                            <p><strong>valorpecas:</strong> {item.valorpecas}</p>
                            <p><strong>valortotal:</strong> {item.valortotal}</p>
                            <p><strong>observacoes:</strong> {item.observacoes}</p>
                        </div>    
                            

                        </div>
                        
                    ))
                ) : (
                    <p>Nenhum dado encontrado.</p>
                    
                )}

                
            </div>
            <Link to="/perfil">AAAAAAAAA</Link>
        </>
    );
}
