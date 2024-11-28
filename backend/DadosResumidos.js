// //CONSULTA OS DADOS
// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');

// const app = express();
// const PORT = 3005;


// app.use(cors());
// app.use(express.json());

// // Configuração do Banco de Dados
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '000000',
//   database: 'racvirtual',
// };

// // Rota para buscar dados da tabela 'racform'
// app.get('/api/rac', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.query('SELECT * FROM racform');
//     await connection.end();

//     res.json(rows); // Envia os dados para o frontend
//   } catch (err) {
//     console.error('Erro ao buscar dados:', err);
//     res.status(500).json({ error: 'Erro ao buscar dados.' });
//   }
// });

// // Inicia o servidor
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`);
// });
