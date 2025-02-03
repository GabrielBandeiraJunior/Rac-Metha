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


const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFormData({
    ...formData,
    file: file,
  });
};
const moment = require('moment');

// Função para processar as datas no formato correto
function processDate(dateString) {
  const formattedDate = moment(dateString, ['YYYY/MM/DD', 'YYYY-MM-DD']).format('YYYY-MM-DD');
  return formattedDate === 'Invalid date' ? null : formattedDate;
}

// Função para processar as horas no formato correto (convertendo de decimal para HH:mm:ss)
function processTime(decimalTime) {
  if (decimalTime == null || isNaN(decimalTime)) return '00:00:00';
  
  const totalMinutes = decimalTime * 24 * 60; // Converte para minutos
  const hours = Math.floor(totalMinutes / 60); // Hora
  const minutes = Math.floor(totalMinutes % 60); // Minutos
  const seconds = Math.floor(((totalMinutes % 60) - minutes) * 60); // Segundos
  
  // Formata a hora no formato HH:mm:ss
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Função para processar valores booleanos
function processBoolean(value) {
  return value === 'true' || value === true || value === '1';
}

// Função para processar os dados da planilha
function processData(sheetData) {
  return sheetData.map(row => {
    return {
      tecnico: row[0],
      razaoSocial: row[1],
      cnpj: row[2],
      endereco: row[3],
      numero: row[4],
      responsavel: row[5],
      setor: row[6],
      cidade: row[7],
      dataInicio: processDate(row[8]),
      horaInicio: processTime(row[9]),
      dataTermino: processDate(row[10]),
      horaTermino: processTime(row[11]),
      instalacaoDeEquipamentos: processBoolean(row[12]),
      manutencaoDeEquipamentos: processBoolean(row[13]),
      homologacaoDeInfra: processBoolean(row[14]),
      treinamentoOperacional: processBoolean(row[15]),
      implantacaoDeSistemas: processBoolean(row[16]),
      manutencaoPreventivaContratual: processBoolean(row[17]),
      repprintpoint2: processBoolean(row[18]),
      repprintpoint3: processBoolean(row[19]),
      repminiprint: processBoolean(row[20]),
      repsmart: processBoolean(row[21]),
      relogiomicropoint: processBoolean(row[22]),
      relogiobiopoint: processBoolean(row[23]),
      catracamicropoint: processBoolean(row[24]),
      catracabiopoint: processBoolean(row[25]),
      catracaceros: processBoolean(row[26]),
      catracaidblock: processBoolean(row[27]),
      catracaidnext: processBoolean(row[28]),
      idface: processBoolean(row[29]),
      idflex: processBoolean(row[30]),
      nSerie: row[31],
      localInstalacao: row[32],
      observacaoProblemas: row[33],
      componente: row[34],
      codigoComponente: row[35],
      observacoes: row[36],
      prestadoraDoServico: row[37]
    };
  });
}



const handleFileUpload = async (event) => {
  const formData = new FormData();
  formData.append('file', event.target.files[0]);

  try {
    const response = await axios.post('http://localhost:3000/racvirtual/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Erro no upload:', error);
    alert(`Erro ao carregar o arquivo: ${error.response ? error.response.data.message : error.message}`);
  }
};

// Endpoint para importar os dados da planilha
app.post('/racvirtual/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado' });
  }

  try {
    // Aqui você pode usar uma biblioteca como xlsx para processar a planilha
    const xlsx = require('xlsx');
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

    // Processa os dados da planilha (exemplo: pegando a primeira aba e convertendo para JSON)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Exemplo: inserir dados no banco de dados (adaptar conforme a estrutura da planilha)
    const query = `INSERT INTO RacForm (
      tecnico, razaoSocial, cnpj, endereco, numero, responsavel, setor, cidade, 
      dataInicio, horaInicio, dataTermino, horaTermino, instalacaoDeEquipamentos, 
      manutencaoDeEquipamentos, homologacaoDeInfra, treinamentoOperacional, 
      implantacaoDeSistemas, manutencaoPreventivaContratual, repprintpoint2, 
      repprintpoint3, repminiprint, repsmart, relogiomicropoint, relogiobiopoint, 
      catracamicropoint, catracabiopoint, catracaceros, catracaidblock, catracaidnext, 
      idface, idflex, nSerie, localInstalacao, observacaoProblemas, componente, 
      codigoComponente, observacoes, prestadoraDoServico
    ) VALUES ?`
      

    const values = data.map(item => [
      item.tecnico,
      item.razaoSocial,
      item.cnpj,
      item.endereco,
      item.numero,
      item.responsavel,
      item.setor,
      item.cidade,
      item.dataInicio,
      item.horaInicio,
      item.dataTermino,
      item.horaTermino,
      item.instalacaoDeEquipamentos !== undefined ? item.instalacaoDeEquipamentos : null,  // Tratamento de nulos
      item.manutencaoDeEquipamentos !== undefined ? item.manutencaoDeEquipamentos : null,
      item.homologacaoDeInfra !== undefined ? item.homologacaoDeInfra : null,
      item.treinamentoOperacional !== undefined ? item.treinamentoOperacional : null,
      item.implantacaoDeSistemas !== undefined ? item.implantacaoDeSistemas : null,
      item.manutencaoPreventivaContratual !== undefined ? item.manutencaoPreventivaContratual : null,
      item.repprintpoint2 !== undefined ? item.repprintpoint2 : null,
      item.repprintpoint3 !== undefined ? item.repprintpoint3 : null,
      item.repminiprint !== undefined ? item.repminiprint : null,
      item.repsmart !== undefined ? item.repsmart : null,
      item.relogiomicropoint !== undefined ? item.relogiomicropoint : null,
      item.relogiobiopoint !== undefined ? item.relogiobiopoint : null,
      item.catracamicropoint !== undefined ? item.catracamicropoint : null,
      item.catracabiopoint !== undefined ? item.catracabiopoint : null,
      item.catracaceros !== undefined ? item.catracaceros : null,
      item.catracaidblock !== undefined ? item.catracaidblock : null,
      item.catracaidnext !== undefined ? item.catracaidnext : null,
      item.idface !== undefined ? item.idface : null,
      item.idflex !== undefined ? item.idflex : null,
      item.nSerie,
      item.localInstalacao,
      item.observacaoProblemas,
      item.componente,
      item.codigoComponente,
      item.observacoes,
      item.prestadoraDoServico
    ]);
    
    

    await db.query(query, [values]);

    res.status(200).json({ message: 'Arquivo carregado e dados inseridos com sucesso' });
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).json({ message: 'Erro ao processar o arquivo', error: error.message });
  }
});


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

app.delete('/racvirtual/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM RacForm WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' });
    }
    res.status(200).json({ message: 'RAC deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar RAC:', error);  // Log de erro detalhado
    res.status(500).json({ message: 'Erro ao deletar RAC', error: error.message });
  }
});


app.listen(PORT, async () => {
  const connection = await db.getConnection();
  await createTableIfNotExists(connection);
  connection.release();
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});