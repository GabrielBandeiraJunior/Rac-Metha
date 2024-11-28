const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()
const PORT = 3000 // Porta unificada

// Configuração do Banco de Dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual',
}

// Middleware
app.use(cors())
app.use(express.json())

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
      horaInicio DATETIME NOT NULL,
      horaTermino DATETIME NOT NULL,
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
      prestadoraDoServico VARCHAR(255) NOT NULL,
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

app.post('/racvirtual/register', async (req, res) => {
  console.log('Dados recebidos:', req.body); // Verifique os dados recebidos

  // Se o corpo da requisição estiver vazio, retorne um erro
  if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Dados ausentes no corpo da requisição' });
  }

  try {
      const [result] = await db.query('INSERT INTO RacForm SET ?', req.body);
      if (result.affectedRows) {
          res.status(200).json({ message: 'Dados salvos com sucesso', data: req.body });
      } else {
          res.status(400).json({ message: 'Falha ao salvar os dados' });
      }
  } catch (error) {
      console.error(error); // Log de erro para depuração
      res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
});


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

app.put('/racvirtual/edit/:id', async (req, res) => {
  const { id } = req.params
  const { date, horaInicio, horaTermino, ...otherFields } = req.body

  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ')
  const formattedHoraInicio = new Date(horaInicio).toISOString().slice(0, 19).replace('T', ' ')
  const formattedHoraTermino = new Date(horaTermino).toISOString().slice(0, 19).replace('T', ' ')

  const updateQuery = `
    UPDATE RacForm
    SET date = ?, horaInicio = ?, horaTermino = ?, ? 
    WHERE id = ?
  `
  try {
    const [result] = await db.query(updateQuery, [formattedDate, formattedHoraInicio, formattedHoraTermino, otherFields, id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' })
    }
    res.status(200).json({ message: 'RAC atualizada com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar RAC', error: error.message })
  }
})

// Inicializar o servidor
app.listen(PORT, async () => {
  const connection = await db.getConnection()
  await createTableIfNotExists(connection)
  connection.release()
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
