const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configuração do Banco de Dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual',
};

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage(); // Armazena arquivos na memória
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());

// Função para criar a tabela se ela não existir
async function createTableIfNotExists(connection) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS RacForm (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tecnico VARCHAR(255),
      razaoSocial VARCHAR(255),
      cnpj VARCHAR(255),
      endereco VARCHAR(255),
      numero VARCHAR(50),
      responsavel VARCHAR(255),
      setor VARCHAR(255),
      cidade VARCHAR(255),
      dataInicio DATE,
      horaInicio TIME,
      dataTermino DATE,
      horaTermino TIME,
      instalacaoDeEquipamentos BOOLEAN,
      manutencaoDeEquipamentos BOOLEAN,
      homologacaoDeInfra BOOLEAN,
      treinamentoOperacional BOOLEAN,
      implantacaoDeSistemas BOOLEAN,
      manutencaoPreventivaContratual BOOLEAN,
      repprintpoint2 BOOLEAN,
      repprintpoint3 BOOLEAN,
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
      nSerie VARCHAR(255),
      localinstalacao VARCHAR(255),
      observacaoproblemas TEXT,
      componente VARCHAR(255),
      codigocomponente VARCHAR(255),
      observacoes TEXT,
      prestadoraDoServico VARCHAR(255),
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.query(createTableQuery);
  console.log('Tabela "RacForm" verificada/criada com sucesso.');
}

// Inicializar banco de dados
const db = mysql.createPool(dbConfig);

// Função para processar campos booleanos
function processBooleanFields(formData) {
  const booleanFields = [
    'instalacaoDeEquipamentos',
    'manutencaoDeEquipamentos',
    'homologacaoDeInfra',
    'treinamentoOperacional',
    'implantacaoDeSistemas',
    'manutencaoPreventivaContratual',
    'repprintpoint2',
    'repprintpoint3',
    'repminiprint',
    'repsmart',
    'relogiomicropoint',
    'relogiobiopoint',
    'catracamicropoint',
    'catracabiopoint',
    'catracaceros',
    'catracaidblock',
    'catracaidnext',
    'idface',
    'idflex',
  ];

  booleanFields.forEach((field) => {
    if (formData[field] !== undefined) {
      formData[field] = formData[field] === 'true' || formData[field] === true ? 1 : 0;
    }
  });

  return formData;
}

function processBooleanFields(formData) {
  // Sua lógica de processamento dos campos booleanos
  return formData;
}

function processDateFields(formData) {
  const dateFields = ['dataInicio', 'dataTermino', 'date'];

  dateFields.forEach((field) => {
    if (formData[field]) {
      // Converte para o formato 'YYYY-MM-DD HH:MM:SS'
      formData[field] = new Date(formData[field]).toISOString().slice(0, 19).replace('T', ' ');
    }
  });

  return formData;
}

function processFormData(formData) {
  formData = processBooleanFields(formData);
  formData = processDateFields(formData);  // Formatação das datas
  return formData;
}



// Endpoint para listar todas as RACs
app.get('/api/dados', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM RacForm');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para registrar dados
app.post('/racvirtual/register', upload.single('file'), async (req, res) => {
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ message: 'Dados ausentes no corpo da requisição' });
  }

  const processedData = processBooleanFields(formData);

  try {
    const [result] = await db.query('INSERT INTO RacForm SET ?', processedData);
    res.status(201).json({ message: 'Dados salvos com sucesso', data: processedData });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
});

// Endpoint para buscar uma RAC específica
app.get('/racvirtual/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM RacForm WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar a RAC', error: error.message });
  }
});

// Endpoint para editar uma RAC
app.put('/racvirtual/edit/:id', async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ message: 'Dados ausentes para atualização' });
  }

  const processedData = processFormData(formData);  // Chama a função definida acima

  try {
    const [result] = await db.query('UPDATE RacForm SET ? WHERE id = ?', [processedData, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' });
    }
    res.status(200).json({ message: 'RAC atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar RAC', error: error.message });
  }
});






// Inicializar o servidor
app.listen(PORT, async () => {
  const connection = await db.getConnection();
  await createTableIfNotExists(connection);
  connection.release();
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
