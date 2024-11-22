// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './DadosResumidos.css'

// const DadosResumidos = () => {
//   const [data, setData] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);

//   // Buscar dados do backend
//   useEffect(() => {
//     axios.get('http://localhost:3005/api/rac')
//       .then(response => setData(response.data))
//       .catch(error => console.error('Erro ao buscar dados:', error));
//   }, []);

//   // Alternar expansão dos detalhes
//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   return (
//     <div>
//       <h1>Lista de RACs</h1>
//       {data.map((item) => (
//         <div key={item.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
//           <p><strong>Técnico:</strong> {item.tecnico}</p>
//           <p><strong>Razão Social:</strong> {item.razaoSocial}</p>

//           {expandedId === item.id ? (
//             <div>
//             <p><strong>Técnico:</strong> {item.tecnico}</p>
//                 <p><strong>Razão Social:</strong> {item.razaoSocial}</p>
//                 <p><strong>CNPJ:</strong> {item.cnpj}</p>
//                 <p><strong>Endereço:</strong> {item.endereco}</p>
//                 <p><strong>Número:</strong> {item.numero}</p>
//                 <p><strong>Cidade:</strong> {item.cidade}</p>
//                 <p><strong>Responsável:</strong> {item.responsavel}</p>
//                 <p><strong>Setor:</strong> {item.setor}</p>
//                 <p><strong>Hora de Início:</strong> {item.horaInicio}</p>
//                 <p><strong>Hora de Término:</strong> {item.horaTermino}</p>
//                 <p><strong>instalacaoDeEquipamentos:</strong> {item.instalacaoDeEquipamentos}</p>
//                 <p><strong>manutencaoDeEquipamentos:</strong> {item.manutencaoDeEquipamentos}</p>
//                 <p><strong>implantacaoDeSistemas  :</strong> {item.implantacaoDeSistemas}</p>
//                 <p><strong>manutencaoPreventivaContratual:</strong> {item.manutencaoPreventivaContratual}</p>
//                 <p><strong>repprintpoint  :</strong> {item.repprintpoint}</p>
//                 <p><strong>repminiprint :</strong> {item.repminiprint}</p>
//                 <p><strong>repsmart :</strong> {item.repsmart}</p>
//                 <p><strong>relogiomicropoint :</strong> {item.relogiomicropoint}</p>
//                 <p><strong>relogiobiopoint :</strong> {item.relogiobiopoint}</p>
//                 <p><strong>atracamicropoint  :</strong> {item.catracamicropoint}</p>
//                 <p><strong>catracabiopoint :</strong> {item.catracabiopoint}</p>
//                 <p><strong>catracaceros :</strong> {item.catracaceros}</p>
//                 <p><strong>catracaidblock :</strong> {item.catracaidblock}</p>
//                 <p><strong>catracaidnext:</strong> {item.catracaidnext}</p>
//                 <p><strong>idface:</strong> {item.idface}</p>
//                 <p><strong>idflex :</strong> {item.idflex}</p>
//                 <p><strong>nSerie :</strong> {item.nSerie}</p>
//                 <p><strong>localinstalacao  :</strong> {item.localinstalacao}</p>
//                 <p><strong>observacaoproblemas:</strong> {item.observacaoproblemas}</p>
//                 <p><strong>componente:</strong> {item.componente}</p>
//                 <p><strong>codigocomponente :</strong> {item.codigocomponente}</p>
//                 <p><strong>observacoes  :</strong> {item.observacoes}</p>
//             </div>
//           ) : null}

//           <button onClick={() => toggleExpand(item.id)}>
//             {expandedId === item.id ? 'Recolher' : 'Expandir'}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DadosResumidos;
