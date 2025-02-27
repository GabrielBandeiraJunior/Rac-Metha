// import React, { useState } from 'react';

// const ConsultaCEP = () => {
//     const [cep, setCep] = useState('');
//     const [endereco, setEndereco] = useState({});
//     const [erro, setErro] = useState('');

//     const obterEnderecoPorCEP = async () => {
//         try {
//             const response = await fetch(`http://localhost:3000/endereco/${cep}`);
//             console.log('Resposta do servidor:', response); // Log da resposta
//             if (!response.ok) {
//                 throw new Error('Erro ao obter o endereço.');
//             }
//             const data = await response.json();
//             console.log('Dados recebidos:', data); // Log dos dados
//             setEndereco(data);
//             setErro('');
//         } catch (error) {
//             console.error('Erro:', error);
//             setErro(error.message || 'Erro ao buscar o endereço. Por favor, verifique o CEP e tente novamente.');
//         }
//     };

//     return (
//         <div>
//             <h2>Consulta de Endereço por CEP</h2>
//             <label htmlFor="cep">CEP:</label>
//             <input
//                 type="text"
//                 id="cep"
//                 value={cep}
//                 onChange={(e) => setCep(e.target.value)}
//                 placeholder="Digite o CEP"
//             />
//             <button id="btnConsultar" onClick={obterEnderecoPorCEP}>
//                 Consultar
//             </button>

//             <div id="enderecoResultado">
//                 {erro ? (
//                     <p style={{ color: 'red' }}>{erro}</p>
//                 ) : (
//                     <>
//                         <p>
//                             <strong>Rua:</strong> <span id="rua">{endereco.logradouro || 'Não informado'}</span>
//                         </p>
//                         <p>
//                             <strong>Cidade:</strong> <span id="cidade">{endereco.localidade || 'Não informado'}</span>
//                         </p>
//                         <p>
//                             <strong>Estado:</strong> <span id="estado">{endereco.uf || 'Não informado'}</span>
//                         </p>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ConsultaCEP;