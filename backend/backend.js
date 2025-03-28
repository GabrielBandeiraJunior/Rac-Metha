const express = require('express')
const mysql = require('mysql2/promise')
const multer = require('multer')
const cors = require('cors')
const axios = require('axios')
const moment = require('moment')
const xlsx = require('xlsx')
const fetch = require('node-fetch')

const app = express()
const PORT = 3000

// Configuração do Banco de Dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual',
}

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage() // Armazena arquivos na memória
const upload = multer({ storage })

// Middleware
app.use(cors())
app.use(express.json())

// Função para criar a tabela se ela não existir
async function createTableIfNotExists(connection) {
  console.log('Verificando se a tabela RacForm existe...')
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
  
      horaIntervaloInicio TIME,
      horaIntervaloTermino TIME,
  
      horaIntervaloInicio2 TIME,
      horaIntervaloTermino2 TIME,
  
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

      impressora BOOLEAN,
      fonte BOOLEAN,
      cabecote BOOLEAN,
      leitor BOOLEAN,
      codigoImpressora varchar(255),
      codigoFonte varchar(255),
      codigoCabecote varchar(255),
      codigoLeitor varchar(255),
      assinatura TEXT,

      observacoes TEXT,
      prestadoraDoServico VARCHAR(255),

      file VARCHAR(255),
      
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  await connection.query(createTableQuery)
  console.log('Tabela "RacForm" verificada/criada com sucesso.')
}

// Inicializar banco de dados
const db = mysql.createPool(dbConfig)

// Função para processar campos booleanos
function processBooleanFields(formData) {
  console.log('Processando campos booleanos...')
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
  ]

  booleanFields.forEach((field) => {
    if (formData[field] !== undefined) {
      formData[field] = formData[field] === 'true' || formData[field] === true ? true : false
    }
  })

  return formData
}

function processDateFields(formData) {
  console.log('Processando campos de data...')
  const dateFields = ['dataInicio', 'dataTermino', 'date']

  dateFields.forEach((field) => {
    if (formData[field]) {
      formData[field] = new Date(formData[field]).toISOString().slice(0, 19).replace('T', ' ')
    }
  })

  return formData
}

function processFormData(formData) {
  console.log('Processando dados do formulário...')
  formData = processBooleanFields(formData)
  formData = processDateFields(formData)
  return formData
}

// Função para processar as datas no formato correto
function processDate(dateString) {
  console.log(`Processando data: ${dateString}`)
  const formattedDate = moment(dateString, ['YYYY/MM/DD', 'YYYY-MM-DD']).format('YYYY-MM-DD')
  console.log(`Data formatada: ${formattedDate}`)
  return formattedDate === 'Invalid date' ? null : formattedDate
}

// Função para processar as horas no formato correto
function processTime(decimalTime) {
  console.log(`Processando tempo decimal: ${decimalTime}`)
  if (decimalTime == null || isNaN(decimalTime)) return '00:00:00'
  
  const totalMinutes = decimalTime * 24 * 60
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)
  const seconds = Math.floor(((totalMinutes % 60) - minutes) * 60)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Função para processar valores booleanos
function processBoolean(value) {
  console.log(`Processando valor booleano: ${value}`)
  return value === 'true' || value === true || value === '1'
}

// Função para processar os dados da planilha
function processData(sheetData) {
  console.log('Processando dados da planilha...')
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
      componentes: row[34],
      codigoComponente: row[35],
      observacoes: row[36],
      prestadoraDoServico: row[37]
    }
  })
}

// Endpoint para importar os dados da planilha
app.post('/racvirtual/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.log('Nenhum arquivo enviado')
    return res.status(400).json({ message: 'Nenhum arquivo enviado' })
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(sheet)

    console.log('Dados da planilha:', data)
    const query = `INSERT INTO RacForm (
      tecnico, razaoSocial, cnpj, endereco, numero, responsavel, setor, cidade, 
      dataInicio, horaInicio, dataTermino, horaTermino, 
      instalacaoDeEquipamentos, 
      manutencaoDeEquipamentos, homologacaoDeInfra, treinamentoOperacional, 
      implantacaoDeSistemas, manutencaoPreventivaContratual, repprintpoint2, 
      repprintpoint3, repminiprint, repsmart, relogiomicropoint, relogiobiopoint, 
      catracamicropoint, catracabiopoint, catracaceros, catracaidblock, catracaidnext, 
      idface, idflex, nSerie, localInstalacao, observacaoProblemas, componentes, 
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
      item.instalacaoDeEquipamentos !== undefined ? item.instalacaoDeEquipamentos : null,
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
      item.componentes,
      item.codigoComponente,
      item.observacoes,
      item.prestadoraDoServico
    ])

    await db.query(query, [values])
    console.log('Dados inseridos com sucesso')
    res.status(200).json({ message: 'Arquivo carregado e dados inseridos com sucesso' })
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error)
    res.status(500).json({ message: 'Erro ao processar o arquivo', error: error.message })
  }
})

// Endpoint para listar todas as RACs
app.get('/racvirtual/list', async (req, res) => {
  try {
    console.log('Consultando dados...')
    
    // Obter parâmetros de filtro e ordenação
    const { 
      razaoSocial, 
      tecnico, 
      dataInicio,
      sortBy = 'date',
      sortOrder = 'DESC'
    } = req.query
    
    // Construir a query base
    let query = 'SELECT * FROM RacForm'
    const conditions = []
    const params = []
    
    // Adicionar filtros
    if (razaoSocial) {
      conditions.push('razaoSocial LIKE ?')
      params.push(`%${razaoSocial}%`)
    }
    
    if (tecnico) {
      conditions.push('tecnico LIKE ?')
      params.push(`%${tecnico}%`)
    }
    
    if (dataInicio) {
      conditions.push('dataInicio = ?')
      params.push(dataInicio)
    }
    
    // Adicionar condições à query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    // Adicionar ordenação
    const validSortColumns = ['date', 'dataInicio', 'razaoSocial', 'tecnico']
    const validSortOrders = ['ASC', 'DESC']
    
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date'
    const sortDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC'
    
    query += ` ORDER BY ${sortColumn} ${sortDirection}`
    
    // Executar a query
    const [results] = await db.query(query, params)
    
    res.json(results)
  } catch (error) {
    console.error('Erro ao consultar os dados:', error)
    res.status(500).json({ error: error.message })
  }
})

// Endpoint para registrar dados
app.post('/racvirtual/register', upload.single('file'), async (req, res) => {
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ message: 'Dados ausentes no corpo da requisição' });
  }

  function processSignature(signatureData) {
    if (!signatureData) return null;
    return signatureData.replace(/^data:image\/\w+;base64,/, '');
  }

  const processedData = processFormData(formData);

  if (formData.assinatura) {
    processedData.assinatura = processSignature(formData.assinatura);
  }

  const fileName = req.file ? req.file.filename : null;
  processedData.file = fileName;

  try {
    const [result] = await db.query('INSERT INTO RacForm SET ?', [processedData]);
    
    console.log('Dados inseridos no banco de dados com sucesso');
    
    res.status(201).json({ 
      message: 'Dados salvos com sucesso', 
      data: {
        ...processedData,
        assinatura: formData.assinatura ? 'assinatura salva' : null
      }
    });
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(500).json({ 
      message: 'Erro interno no servidor', 
      error: error.message 
    });
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
    
    const rac = rows[0];
    
    // Se houver assinatura, formatar para enviar ao frontend
    if (rac.assinatura) {
      rac.assinatura = `data:image/png;base64,${rac.assinatura}`;
    }
    
    res.json(rac);
  } catch (error) {
    console.error('Erro ao buscar RAC:', error);
    res.status(500).json({ message: 'Erro ao buscar RAC', error: error.message });
  }
});

// Endpoint para buscar assinatura
app.get('/racvirtual/assinatura/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await db.query('SELECT assinatura FROM RacForm WHERE id = ?', [id]);
    
    if (rows.length === 0 || !rows[0].assinatura) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }
    
    const signatureData = `data:image/png;base64,${rows[0].assinatura}`;
    res.json({ assinatura: signatureData });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({ message: 'Erro ao buscar assinatura', error: error.message });
  }
});

// Endpoint para obter CEP
app.get('/endereco/:cep', async (req, res) => {
  const { cep } = req.params;
  try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
          throw new Error('Erro ao consultar o ViaCEP.');
      }
      const data = await response.json();
      if (data.erro) {
          throw new Error('CEP não encontrado.');
      }
      res.json(data);
  } catch (error) {
      console.error('Erro no backend:', error.message);
      res.status(500).json({ error: error.message });
  }
});

// Endpoint para editar RAC
app.put('/racvirtual/edit/:id', async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ message: 'Dados ausentes para atualização' });
  }

  function processSignature(signatureData) {
    if (!signatureData) return null;
    return signatureData.replace(/^data:image\/\w+;base64,/, '');
  }

  const processedData = processFormData(formData);

  if (formData.assinatura) {
    processedData.assinatura = processSignature(formData.assinatura);
  }

  try {
    const [result] = await db.query('UPDATE RacForm SET ? WHERE id = ?', [processedData, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' });
    }
    res.status(200).json({ message: 'RAC atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar RAC:', error);
    res.status(500).json({ message: 'Erro ao atualizar RAC', error: error.message });
  }
});

// Endpoint para deletar RAC
app.delete('/racvirtual/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await db.query('DELETE FROM RacForm WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' })
    }
    res.status(200).json({ message: 'RAC deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar RAC:', error)
    res.status(500).json({ message: 'Erro ao deletar RAC', error: error.message })
  }
})

// Iniciar servidor
app.listen(PORT, async () => {
  const connection = await db.getConnection()
  await createTableIfNotExists(connection)
  connection.release()
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})