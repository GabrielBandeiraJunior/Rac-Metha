const express = require('express')
const mysql = require('mysql2/promise')
const multer = require('multer')
const cors = require('cors')
const XLSX = require('xlsx');


const app = express()
const PORT = 3000 // Porta unificada

// Configuração do Banco de Dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual',
}

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();  // Armazenar o arquivo na memória
const upload = multer({ storage: storage });

// Middleware
app.use(cors())
app.use(express.json())

// Função para criar a tabela se ela não existir
async function createTableIfNotExists(connection) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS RacForm (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tecnico VARCHAR(255) ,
      razaoSocial VARCHAR(255),
      cnpj VARCHAR(255) ,
      endereco VARCHAR(255) ,
      numero VARCHAR(50) ,
      responsavel VARCHAR(255) ,
      setor VARCHAR(255) ,
      cidade VARCHAR(255) ,
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
      nSerie VARCHAR(255) ,
      localinstalacao VARCHAR(255) ,
      observacaoproblemas VARCHAR(255) ,
      componente VARCHAR(255) ,
      codigocomponente VARCHAR(255) ,
      observacoes VARCHAR(255) ,
      prestadoraDoServico VARCHAR(255) ,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  await connection.query(createTableQuery)
  console.log('Tabela "RacForm" verificada/criada com sucesso.')
}

// Inicializar banco de dados
const db = mysql.createPool(dbConfig)

// Endpoints
app.get('/api/dados', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM RacForm')
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Função para tratar e corrigir os valores booleanos antes de salvar no banco
function processBooleanFields(formData) {
  const fieldsToProcess = [
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
    'idflex'
  ];

  fieldsToProcess.forEach(field => {
    if (formData[field] !== undefined) {
      // Verifique se o valor é string 'true' ou 'false' e converta para 1 ou 0
      if (formData[field] === 'true') {
        formData[field] = 1; // Marca como 1 (true)
      } else if (formData[field] === 'false') {
        formData[field] = 0; // Marca como 0 (false)
      }
      // Se o valor for um booleano verdadeiro, defina como 1
      else if (formData[field] === true) {
        formData[field] = 1;
      }
      // Se o valor for booleano falso, defina como 0
      else if (formData[field] === false) {
        formData[field] = 0;
      }
    }
  });

  return formData;
}

app.post('/racvirtual/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado');
  }

  // Log para verificar a estrutura do arquivo recebido
  console.log('Arquivo recebido:', req.file);
  console.log('Tamanho do arquivo:', req.file.size);

  // Usar o buffer para ler o arquivo Excel diretamente
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Converte os dados da planilha para JSON
  const dados = XLSX.utils.sheet_to_json(worksheet);

  // Log dos dados extraídos da planilha
  console.log('Dados extraídos da planilha:', dados);

  // Aqui você pode processar os dados e armazená-los no banco de dados
  // Exemplo fictício de como salvar os dados no banco (ajuste conforme seu modelo)
  // Model.create(dados).then(() => res.status(200).send('Planilha importada com sucesso'));

  res.status(200).send('Planilha importada com sucesso');
});



// Endpoint para registrar dados
app.post('/racvirtual/register', upload.single('file'), async (req, res) => {
  
  const formData = req.body;

  console.log('Dados recebidos:', formData); // Verifique os dados recebidos

  // Se o corpo da requisição estiver vazio, retorne um erro
  if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ message: 'Dados ausentes no corpo da requisição' });
  }

  // Processa os campos booleanos
  const processedData = processBooleanFields(formData);

  try {
      const [result] = await db.query('INSERT INTO RacForm SET ?', processedData);
      if (result.affectedRows) {
          res.status(200).json({ message: 'Dados salvos com sucesso', data: processedData });
      } else {
          res.status(400).json({ message: 'Falha ao salvar os dados' });
      }
  } catch (error) {
      console.error(error); // Log de erro para depuração
      res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
});

// Endpoint para buscar uma RAC específica
app.get('/racvirtual/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query('SELECT * FROM RacForm WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' })
    }
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar a RAC', error: error.message })
  }
})

// Endpoint para deletar uma RAC
app.delete('/racvirtual/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await db.query('DELETE FROM RacForm WHERE id = ?', [id])
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' })
    }
    
    res.status(200).json({ message: 'RAC deletada com sucesso' })
  } catch (error) {
    console.error(error)  // Log de erro para depuração
    res.status(500).json({ message: 'Erro ao deletar RAC', error: error.message })
  }
})



// Endpoint para editar uma RAC
app.put('/racvirtual/edit/:id', async (req, res) => {
  const { id } = req.params
  const { date, horaInicio, horaTermino, ...otherFields } = req.body

  // Certifique-se de que a data está sendo convertida corretamente
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  // Hora já está no formato correto. Apenas passe como está.
  const formattedHoraInicio = horaInicio;  // Não é necessário usar new Date() para hora
  const formattedHoraTermino = horaTermino;  // Também passe a hora diretamente

  const updateQuery = `
    UPDATE RacForm
    SET date = ?, horaInicio = ?, horaTermino = ?, ? 
    WHERE id = ?
  `;
  
  try {
    const [result] = await db.query(updateQuery, [formattedDate, formattedHoraInicio, formattedHoraTermino, otherFields, id])
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' });
    }
    
    res.status(200).json({ message: 'RAC atualizada com sucesso' });
  } catch (error) {
    console.error(error);  // Log de erro para depuração
    res.status(500).json({ message: 'Erro ao atualizar RAC', error: error.message });
  }
});


// Inicializar o servidor
app.listen(PORT, async () => {
  const connection = await db.getConnection()
  await createTableIfNotExists(connection)
  connection.release()
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})