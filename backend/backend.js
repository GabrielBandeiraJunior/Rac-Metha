const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
const moment = require('moment');
const xlsx = require('xlsx');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual'
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

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
      impressora BOOLEAN,
      fonte BOOLEAN,
      cabecote BOOLEAN,
      leitor BOOLEAN,
      nSerie VARCHAR(255),
      localinstalacao VARCHAR(255),
      observacaoproblemas TEXT,
      codigoImpressora VARCHAR(255),
      codigoFonte VARCHAR(255),
      codigoCabecote VARCHAR(255),
      codigoLeitor VARCHAR(255),
      observacoes TEXT,
      prestadoraDoServico VARCHAR(255),
      assinatura TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.query(createTableQuery);
}

const db = mysql.createPool(dbConfig);

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
    'impressora',
    'fonte',
    'cabecote',
    'leitor'
  ];

  booleanFields.forEach((field) => {
    if (formData[field] !== undefined && formData[field] !== null) {
      formData[field] = formData[field] === 'true' || formData[field] === true || formData[field] === 1 || formData[field] === '1';
    } else {
      formData[field] = false;
    }
  });

  return formData;
}

function processDateFields(formData) {
  const dateFields = ['dataInicio', 'dataTermino'];

  dateFields.forEach((field) => {
    if (formData[field]) {
      if (typeof formData[field] === 'string') {
        const parts = formData[field].split('/');
        if (parts.length === 3) {
          formData[field] = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else if (formData[field] instanceof Date) {
        formData[field] = moment(formData[field]).format('YYYY-MM-DD');
      }
    }
  });

  return formData;
}

function processTimeFields(formData) {
  const timeFields = [
    'horaInicio',
    'horaTermino',
    'horaIntervaloInicio',
    'horaIntervaloTermino',
    'horaIntervaloInicio2',
    'horaIntervaloTermino2'
  ];

  timeFields.forEach((field) => {
    if (formData[field] !== undefined && formData[field] !== null) {
      if (typeof formData[field] === 'string' && formData[field].match(/^\d{2}:\d{2}:\d{2}$/)) {
        return;
      }
      
      if (typeof formData[field] === 'number') {
        const excelTime = formData[field];
        const totalSeconds = Math.floor(excelTime * 86400);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        formData[field] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return;
      }
      
      if (typeof formData[field] === 'string' && formData[field].match(/^\d{1,2}:\d{2}$/)) {
        const [hours, minutes] = formData[field].split(':');
        formData[field] = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
        return;
      }
      
      if (typeof formData[field] === 'string' && formData[field].match(/^\d{1,2}:\d{1,2}:\d{1,2}$/)) {
        const [hours, minutes, seconds] = formData[field].split(':');
        formData[field] = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        return;
      }
      
      formData[field] = null;
    }
  });

  return formData;
}

function processFormData(formData) {
  formData = processBooleanFields(formData);
  formData = processDateFields(formData);
  formData = processTimeFields(formData);
  
  if (!formData.impressora) formData.codigoImpressora = null;
  if (!formData.fonte) formData.codigoFonte = null;
  if (!formData.cabecote) formData.codigoCabecote = null;
  if (!formData.leitor) formData.codigoLeitor = null;
  
  delete formData.id;
  delete formData.date;
  
  return formData;
}

function processSheetData(workbook) {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });

  const racData = {
    tecnico: sheetData[0] && sheetData[0][1] !== undefined ? String(sheetData[0][1]) : null,
    razaoSocial: sheetData[1] && sheetData[1][1] !== undefined ? String(sheetData[1][1]) : null,
    cnpj: sheetData[2] && sheetData[2][1] !== undefined ? String(sheetData[2][1]) : null,
    endereco: sheetData[3] && sheetData[3][1] !== undefined ? String(sheetData[3][1]) : null,
    numero: sheetData[4] && sheetData[4][1] !== undefined ? String(sheetData[4][1]) : null,
    responsavel: sheetData[5] && sheetData[5][1] !== undefined ? String(sheetData[5][1]) : null,
    setor: sheetData[6] && sheetData[6][1] !== undefined ? String(sheetData[6][1]) : null,
    cidade: sheetData[7] && sheetData[7][1] !== undefined ? String(sheetData[7][1]) : null,
    dataInicio: sheetData[0] && sheetData[0][3] !== undefined ? sheetData[0][3] : null,
    horaInicio: sheetData[1] && sheetData[1][3] !== undefined ? sheetData[1][3] : null,
    dataTermino: sheetData[2] && sheetData[2][3] !== undefined ? sheetData[2][3] : null,
    horaTermino: sheetData[3] && sheetData[3][3] !== undefined ? sheetData[3][3] : null,
    horaIntervaloInicio: sheetData[4] && sheetData[4][3] !== undefined ? sheetData[4][3] : null,
    horaIntervaloTermino: sheetData[5] && sheetData[5][3] !== undefined ? sheetData[5][3] : null,
    horaIntervaloInicio2: sheetData[6] && sheetData[6][3] !== undefined ? sheetData[6][3] : null,
    horaIntervaloTermino2: sheetData[7] && sheetData[7][3] !== undefined ? sheetData[7][3] : null,
    instalacaoDeEquipamentos: sheetData[0] && sheetData[0][5] !== undefined ? sheetData[0][5] : false,
    manutencaoDeEquipamentos: sheetData[1] && sheetData[1][5] !== undefined ? sheetData[1][5] : false,
    homologacaoDeInfra: sheetData[2] && sheetData[2][5] !== undefined ? sheetData[2][5] : false,
    treinamentoOperacional: sheetData[3] && sheetData[3][5] !== undefined ? sheetData[3][5] : false,
    implantacaoDeSistemas: sheetData[4] && sheetData[4][5] !== undefined ? sheetData[4][5] : false,
    manutencaoPreventivaContratual: sheetData[5] && sheetData[5][5] !== undefined ? sheetData[5][5] : false,
    repprintpoint2: sheetData[0] && sheetData[0][7] !== undefined ? sheetData[0][7] : false,
    repprintpoint3: sheetData[1] && sheetData[1][7] !== undefined ? sheetData[1][7] : false,
    repminiprint: sheetData[2] && sheetData[2][7] !== undefined ? sheetData[2][7] : false,
    repsmart: sheetData[3] && sheetData[3][7] !== undefined ? sheetData[3][7] : false,
    relogiomicropoint: sheetData[4] && sheetData[4][7] !== undefined ? sheetData[4][7] : false,
    relogiobiopoint: sheetData[5] && sheetData[5][7] !== undefined ? sheetData[5][7] : false,
    catracamicropoint: sheetData[6] && sheetData[6][7] !== undefined ? sheetData[6][7] : false,
    catracabiopoint: sheetData[7] && sheetData[7][7] !== undefined ? sheetData[7][7] : false,
    catracaceros: sheetData[8] && sheetData[8][7] !== undefined ? sheetData[8][7] : false,
    catracaidblock: sheetData[9] && sheetData[9][7] !== undefined ? sheetData[9][7] : false,
    catracaidnext: sheetData[10] && sheetData[10][7] !== undefined ? sheetData[10][7] : false,
    idface: sheetData[11] && sheetData[11][7] !== undefined ? sheetData[11][7] : false,
    idflex: sheetData[12] && sheetData[12][7] !== undefined ? sheetData[12][7] : false,
    impressora: sheetData[0] && sheetData[0][9] !== undefined ? sheetData[0][9] : false,
    fonte: sheetData[1] && sheetData[1][9] !== undefined ? sheetData[1][9] : false,
    cabecote: sheetData[2] && sheetData[2][9] !== undefined ? sheetData[2][9] : false,
    leitor: sheetData[3] && sheetData[3][9] !== undefined ? sheetData[3][9] : false,
    codigoImpressora: sheetData[0] && sheetData[0][9] && sheetData[4] && sheetData[4][9] !== undefined ? String(sheetData[4][9]) : null,
    codigoFonte: sheetData[1] && sheetData[1][9] && sheetData[5] && sheetData[5][9] !== undefined ? String(sheetData[5][9]) : null,
    codigoCabecote: sheetData[2] && sheetData[2][9] && sheetData[6] && sheetData[6][9] !== undefined ? String(sheetData[6][9]) : null,
    codigoLeitor: sheetData[3] && sheetData[3][9] && sheetData[7] && sheetData[7][9] !== undefined ? String(sheetData[7][9]) : null,
    nSerie: sheetData[0] && sheetData[0][11] !== undefined ? String(sheetData[0][11]) : null,
    localinstalacao: sheetData[1] && sheetData[1][11] !== undefined ? String(sheetData[1][11]) : null,
    observacaoproblemas: sheetData[2] && sheetData[2][11] !== undefined ? String(sheetData[2][11]) : null,
    observacoes: sheetData[3] && sheetData[3][11] !== undefined ? String(sheetData[3][11]) : null,
    prestadoraDoServico: sheetData[4] && sheetData[4][11] !== undefined ? String(sheetData[4][11]) : null
  };

  return processFormData(racData);
}

app.post('/racvirtual/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const racData = processSheetData(workbook);
    const query = `INSERT INTO RacForm SET ?`;
    await db.query(query, [racData]);
    res.status(200).json({ message: 'Arquivo carregado e dados inseridos com sucesso', data: racData });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar o arquivo', error: error.message });
  }
});

app.get('/racvirtual/list', async (req, res) => {
  try {
    const { razaoSocial, tecnico, dataInicio, sortBy = 'date', sortOrder = 'DESC' } = req.query;
    let query = `SELECT *, impressora = 1 as impressora, fonte = 1 as fonte, cabecote = 1 as cabecote, leitor = 1 as leitor FROM RacForm`;
    const conditions = [];
    const params = [];

    if (razaoSocial) {
      conditions.push('razaoSocial LIKE ?');
      params.push(`%${razaoSocial}%`);
    }
    if (tecnico) {
      conditions.push('tecnico LIKE ?');
      params.push(`%${tecnico}%`);
    }
    if (dataInicio) {
      conditions.push('dataInicio = ?');
      params.push(dataInicio);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const validSortColumns = ['date', 'dataInicio', 'razaoSocial', 'tecnico'];
    const validSortOrders = ['ASC', 'DESC'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
    const sortDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    query += ` ORDER BY ${sortColumn} ${sortDirection}`;

    const [results] = await db.query(query, params);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Endpoint para registrar dados manualmente
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

  // Remove o campo date se ele existir (deixe o MySQL usar o valor atual ou DEFAULT)
  delete processedData.date;

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

// Endpoint para buscar empresas por razão social
app.get('/empresas/buscar', async (req, res) => {
  const { termo } = req.query;
  
  try {
    const [rows] = await db.query(
      `SELECT id, razaoSocial, cnpj, endereco, numero, cidade 
       FROM DadosEmpresas 
       WHERE razaoSocial LIKE ? 
       LIMIT 10`, 
      [`%${termo}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

// Endpoint para buscar detalhes completos de uma empresa
app.get('/empresas/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await db.query(
      `SELECT * FROM DadosEmpresas WHERE id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});



// IMPORTAÇÃO DE PLANILHA COM DADOS DOS CLIENTES
// Adicione estas novas rotas ao seu arquivo backend existente

// Rota para pré-visualização da planilha
app.post('/api/importar/preview', upload.single('planilha'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(worksheet);

    // Mapear os dados da planilha para o formato do banco de dados
    const dadosMapeados = dados.map(item => ({
      razaoSocial: item['Nome'] || item['Razão Social'] || null,
      nomeFantasia: item['Fantasia'] || null,
      cnpj: item['CNPJ/CPF'] || null,
      endereco: item['Endereço'] || null,
      cidade: item['Cidade'] || null,
      responsavel: item['Contato'] || null,
      telefone: item['Fone'] || null,
      contato: item['Contato'] || null,
      inscricaoEstadual: item['Inscr. Estadual'] || null,
      uf: item['UF'] || null,
      bairro: item['Bairro'] || null,
      cep: item['Cep'] || null,
      email: item['Email'] || null,
      observacoes: item['Obs.'] || null
    }));

    res.json(dadosMapeados);
  } catch (error) {
    console.error('Erro ao processar planilha:', error);
    res.status(500).json({ error: 'Erro ao processar planilha' });
  }
});

// Rota para importação dos dados
app.post('/api/importar', upload.single('planilha'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(worksheet);

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      let registrosInseridos = 0;

      for (const item of dados) {
        const query = `
          INSERT INTO DadosEmpresas (
            Código,Nome,Fantasia,Fone,Contato,
            CNPJ/CPF,Inscr. Estadual,UF,Cidade,Bairro,
            Endereço,Cep,Vendedor,Gerente,Grupo,Tabela,
            Banco,FormaPag,Data Cad,Fone 2,Email,Obs.

          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          item['Nome'] || item['Fantasia'] || null,
          item['CNPJ/CPF'] || null,
          item['Endereço'] || null,
          item['Cidade'] || null,
          item['Contato'] || null,
          item['Fone'] || null,
          item['Contato'] || null,
          item['Inscr. Estadual'] || null,
          item['UF'] || null,
          item['Bairro'] || null,
          item['Cep'] || null,
          item['Email'] || null,
          item['Obs.'] || null
        ];

        await connection.execute(query, values);
        registrosInseridos++;
      }

      await connection.commit();
      res.json({ success: true, registrosInseridos });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    res.status(500).json({ error: 'Erro ao importar dados' });
  }
});
//////////////////////////////////////////////////////////////////

// Iniciar servidor
app.listen(PORT, async () => {
  const connection = await db.getConnection()
  await createTableIfNotExists(connection)
  connection.release()
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})