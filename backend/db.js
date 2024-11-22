const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3004;

// Configurar CORS
app.use(cors());
app.use(express.json());

// Configuração do MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual'
};

// Função para criar a tabela se ela não existir
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
      homologacaoDeInfra BOOLEAN,
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
      catracaceros BOOLEAN,
      catracaidblock BOOLEAN,
      catracaidnext BOOLEAN,
      idface BOOLEAN,
      idflex BOOLEAN,
      nSerie VARCHAR(255) NOT NULL,
      localinstalacao VARCHAR(255) NOT NULL,
      observacaoproblemas VARCHAR(255) NOT NULL,
      componente VARCHAR(255) NOT NULL,
      codigocomponente VARCHAR(255) NOT NULL,
      observacoes VARCHAR(255) NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.query(createTableQuery);
  console.log('Tabela "RacForm" verificada/criada com sucesso.');
}

// Função para inicializar o banco de dados e criar tabela se necessário
async function initializeDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  await createTableIfNotExists(connection);
  app.locals.db = connection;
}

// Rota para obter dados
app.get('/api/dados', async (req, res) => {
  try {
    const [results] = await app.locals.db.query('SELECT * FROM RacForm');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para registrar dados
app.post('/racvirtual/register', async (req, res) => {
  try {
    const [result] = await app.locals.db.query('INSERT INTO RacForm SET ?', req.body);
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

  // Rota para deletar um registro
  app.delete('/racvirtual/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await app.locals.db.query('DELETE FROM RacForm WHERE id = ?', [id]);
      if (result.affectedRows) {
        res.status(200).json({ message: "Registro deletado com sucesso" });
      } else {
        res.status(404).json({ message: "Registro não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar o registro" });
      console.error("Erro ao deletar registro:", error);
    }
  });


// Inicializar o banco de dados e iniciar o servidor
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Erro ao conectar ao banco de dados MySQL:', error);
  });


