const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

// Configuração do MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual',
};

async function createTableIfNotExists(connection) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS RacForm (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tecnico VARCHAR(255) NOT NULL,
      razaoSocial VARCHAR(255),
      cnpj VARCHAR(255) NOT NULL,
      endereco VARCHAR(255) NOT NULL,
      numero VARCHAR(50) NOT NULL,
      responsavel VARCHAR(255) NOT NULL,
      setor VARCHAR(255) NOT NULL,
      cidade VARCHAR(255) NOT NULL,
      horaInicio VARCHAR(50) NOT NULL,
      horaTermino VARCHAR(50) NOT NULL,
      instalacaoDeEquipamentos BOOLEAN,
      manutencaoDeEquipamentos BOOLEAN,
      customizacao BOOLEAN,
      diagnosticoDeProjetos BOOLEAN,
      homologacaoDeInfra BOOLEAN,
      deslocamento BOOLEAN,
      treinamentoOperacional BOOLEAN,
      implantacaoDeSistemas BOOLEAN,
      manutencaoPreventivaContratual BOOLEAN,
      repprintpoint BOOLEAN,
      repminiprint BOOLEAN,
      repsmart BOOLEAN,
      relogiomicropoint BOOLEAN,
      relogiobiopoint BOOLEAN,
      catracamicropoint BOOLEAN,
      catracabiopoint BOOLEAN,
      suporteTi BOOLEAN,
      nserie VARCHAR(255) NOT NULL,
      localinstalacao VARCHAR(255) NOT NULL,
      observacaoproblemas VARCHAR(255) NOT NULL,
      componente VARCHAR(255) NOT NULL,
      codigocomponente VARCHAR(255) NOT NULL,
      valorvisita VARCHAR(255) NOT NULL,
      valorrs VARCHAR(255) NOT NULL,
      valorpecas VARCHAR(255) NOT NULL,
      valortotal VARCHAR(255) NOT NULL,
      observacoes VARCHAR(255) NOT NULL,
      
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await connection.query(createTableQuery);
  console.log('Tabela "RacForm" verificada/criada com sucesso.');
}

// Conectar ao MySQL e criar tabela se necessário
async function initializeDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  await createTableIfNotExists(connection);
  return connection;
}

// Inicialização do banco de dados
initializeDatabase().then(connection => {
  app.locals.db = connection;
}).catch(error => {
  console.error('Erro ao conectar ao banco de dados MySQL:', error);
});

app.use(express.json());
app.use(cors());

app.post("/racvirtual/register", async (req, res) => {
  try {
    console.log(req.body); // Verificar os dados recebidos
    const [result] = await req.app.locals.db.query('INSERT INTO RacForm SET ?', req.body);
    if (result.affectedRows) {
      res.status(200).json({ message: "Dados salvos com sucesso", data: req.body });
    } else {
      res.status(400).json({ message: "Falha ao salvar os dados" });
    }
  } catch (e) {
    res.status(500).json({ message: "Erro interno no servidor" });
    console.error("Erro ao salvar dados:", e);
  }
});

app.listen(port, () => {
  console.log(`Servidor a rodando em http://localhost:${port}`);
});
