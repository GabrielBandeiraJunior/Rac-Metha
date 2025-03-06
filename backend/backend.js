const express = require('express')
const mysql = require('mysql2/promise')
const multer = require('multer')
const cors = require('cors')
const axios = require('axios')
const moment = require('moment')
const xlsx = require('xlsx')
const fetch = require ('node-fetch')

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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

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
      observacaoProblemas TEXT,
      componentes TEXT,
      codigoComponente TEXT,
      observacoes TEXT,
      prestadoraDoServico VARCHAR(100),
      assinatura TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP



      
    )
  `
  await connection.query(createTableQuery)
  console.log('Tabela "RacForm" verificada/criada com sucesso.')
}

// Inicializar banco de dados
const db = mysql.createPool(dbConfig)

// Função para processar campos booleanos
function processBooleanFields(data) {
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
    if (data[field] !== undefined) {
      data[field] = Boolean(data[field]);
    }
  });

  return data;
}


function processDateFields(formData) {
  console.log('Processando campos de data...')
  const dateFields = ['dataInicio', 'dataTermino', 'date']

  dateFields.forEach((field) => {
    if (formData[field]) {
      // Converte para o formato 'YYYY-MM-DD HH:MM:SS'
      formData[field] = new Date(formData[field]).toISOString().slice(0, 19).replace('T', ' ')
      console.log(`Campo de data ${field} formatado como: ${formData[field]}`)
    }
  })

  return formData
}

function processFormData(formData) {
  console.log('Processando dados do formulário...')
  formData = processBooleanFields(formData)
  formData = processDateFields(formData)  // Formatação das datas
  return formData
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  console.log('Arquivo selecionado:', file)
  setFormData({
    ...formData,
    file: file,
  })
}

// Função para processar as datas no formato correto
function processDate(dateString) {
  console.log(`Processando data: ${dateString}`)
  const formattedDate = moment(dateString, ['YYYY/MM/DD', 'YYYY-MM-DD']).format('YYYY-MM-DD')
  console.log(`Data formatada: ${formattedDate}`)
  return formattedDate === 'Invalid date' ? null : formattedDate
}

// Função para processar as horas no formato correto (convertendo de decimal para HH:mm:ss)
function processTime(decimalTime) {
  console.log(`Processando tempo decimal: ${decimalTime}`)
  if (decimalTime == null || isNaN(decimalTime)) return '00:00:00'
  
  const totalMinutes = decimalTime * 24 * 60 // Converte para minutos
  const hours = Math.floor(totalMinutes / 60) // Hora
  const minutes = Math.floor(totalMinutes % 60) // Minutos
  const seconds = Math.floor(((totalMinutes % 60) - minutes) * 60) // Segundos
  
  // Formata a hora no formato HH:mm:ss
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

// Função de upload
const handleFileUpload = async (event) => {
  const formData = new FormData()
  formData.append('file', event.target.files[0])

  try {
    console.log('Iniciando upload...')
    const response = await axios.post('http://localhost:3000/racvirtual/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(response.data)
  } catch (error) {
    console.error('Erro no upload:', error)
    alert(`Erro ao carregar o arquivo: ${error.response ? error.response.data.message : error.message}`)
  }
}

// Endpoint para importar os dados da planilha
app.post('/racvirtual/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.log('Nenhum arquivo enviado')
    return res.status(400).json({ message: 'Nenhum arquivo enviado' })
  }

  try {
    // Aqui você pode usar uma biblioteca como xlsx para processar a planilha
    const xlsx = require('xlsx')
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
app.get('/api/dados', async (req, res) => {
  try {
    console.log('Consultando dados...')
    const [results] = await db.query('SELECT * FROM RacForm')
    res.json(results)
  } catch (error) {
    console.error('Erro ao consultar os dados:', error)
    res.status(500).json({ error: error.message })
  }
})

// Endpoint para registrar dados
app.post('/racvirtual/register', upload.single('file'), async (req, res) => {
  const formData = req.body;

  // Log do corpo da requisição
  console.log('Dados recebidos no corpo da requisição:', formData);

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ message: 'Dados ausentes no corpo da requisição' });
  }

  // Serializa os campos componentes e codigoComponente
  if (formData.componentes) {
    formData.componentes = JSON.stringify(formData.componentes); // Converte array para string JSON
  }
  if (formData.codigoComponente) {
    formData.codigoComponente = JSON.stringify(formData.codigoComponente); // Converte objeto para string JSON
  }

  // Processa os campos booleanos
  const processedData = processBooleanFields(formData);

  // Log dos dados processados
  console.log('Dados processados:', processedData);

  // Verifica se há um arquivo carregado
  const fileName = req.file ? req.file.filename : null;

  // Adiciona o campo 'file' ao processedData
  processedData.file = fileName;

  try {
    // Inserção correta no banco de dados
    const [result] = await db.query('INSERT INTO RacForm SET ?', [processedData]);

    // Log após inserção no banco de dados
    console.log('Dados inseridos no banco de dados:', result);

    res.status(201).json({ message: 'Dados salvos com sucesso', data: processedData });
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
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


//OBTER CEP

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
      res.json(data); // Retorna o JSON do endereço
  } catch (error) {
      console.error('Erro no backend:', error.message);
      res.status(500).json({ error: error.message }); // Retorna um JSON de erro
  }
});
//================

// Endpoint para editar uma RAC
// app.put('/racvirtual/edit/:id', async (req, res) => {
//   const { id } = req.params
//   const formData = req.body

//   if (!formData || Object.keys(formData).length === 0) {
//     return res.status(400).json({ message: 'Dados ausentes para atualização' })
//   }

//   const processedData = processFormData(formData)  // Chama a função definida acima

//   try {
//     const [result] = await db.query('UPDATE RacForm SET ? WHERE id = ?', [processedData, id])
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'RAC não encontrada' })
//     }
//     res.status(200).json({ message: 'RAC atualizada com sucesso' })
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar RAC', error: error.message })
//   }
// })

app.put('/racvirtual/edit/:id', async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ message: 'Dados ausentes para atualização' });
  }

  const processedData = processFormData(formData)

  // Lista de campos booleanos
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

  // Cria um objeto com apenas os campos que foram enviados na requisição
  const updatedData = {};
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      if (booleanFields.includes(key)) {
        // Converte para booleano (true/false)
        updatedData[key] = formData[key] === 'true' || formData[key] === true || formData[key] === 1;
      } else {
        updatedData[key] = formData[key];
      }
    }
  }

  try {
    // Atualiza apenas os campos que foram enviados na requisição
    const [result] = await db.query('UPDATE RacForm SET ? WHERE id = ?', [updatedData, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' });
    }
    res.status(200).json({ message: 'RAC atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar RAC:', error);
    res.status(500).json({ message: 'Erro ao atualizar RAC', error: error.message });
  }
});

app.delete('/racvirtual/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await db.query('DELETE FROM RacForm WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'RAC não encontrada' })
    }
    res.status(200).json({ message: 'RAC deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar RAC:', error)  // Log de erro detalhado
    res.status(500).json({ message: 'Erro ao deletar RAC', error: error.message })
  }
})


app.post('/assinatura', (req, res) => {
  const { assinatura } = req.body;

  if (!assinatura) {
    return res.status(400).json({ message: 'Assinatura não recebida.' });
  }

  // Definir o caminho do arquivo onde a imagem será salva
  const nomeArquivo = `assinatura_${Date.now()}.png`;
  const caminhoArquivo = path.join(__dirname, 'assinaturas', nomeArquivo);

  // Converter a assinatura base64 em imagem e salvar
  const base64Data = assinatura.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(caminhoArquivo, base64Data, 'base64', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao salvar a assinatura.' });
    }

    // Retornar resposta de sucesso
    res.status(200).json({ message: 'Assinatura salva com sucesso!' });
  });
});

app.get('/assinatura', (req, res) => {
  const id = req.query.id || 1;

  db.query('SELECT assinatura FROM racform WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error("Erro ao buscar a assinatura no banco de dados:", err);
      return res.status(500).send('Erro ao recuperar a imagem');
    }

    if (result.length > 0) {
      const imageData = result[0].assinatura;
      if (!imageData) {
        return res.status(404).send('Assinatura não encontrada no banco de dados');
      }

      console.log("Imagem retornada do banco de dados:", imageData);  // Adicionando o log
      res.json({ image: imageData });
    } else {
      res.status(404).send('Imagem não encontrada');
    }
  });
});


app.listen(PORT, async () => {
  const connection = await db.getConnection()
  await createTableIfNotExists(connection)
  connection.release()
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
