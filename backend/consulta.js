const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3003;

// Configurar CORS
app.use(cors());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'racvirtual'
});

// Rota para obter dados
app.get('/api/dados', (req, res) => {
    db.query('SELECT * FROM racform', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
