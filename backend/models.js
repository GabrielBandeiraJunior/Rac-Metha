const { Sequelize, DataTypes } = require('sequelize');

// Conexão com o banco de dados MySQL
const sequelize = new Sequelize('racvirtual', 'root', '000000', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

async function createRacForm(formData) {
  // Processar os campos booleanos
  formData = processBooleanFields(formData);
  
  // Processar as datas e horas
  formData = processDateAndTimeFields(formData);

  try {
    // Inserir dados processados na tabela
    const novoFormulario = await RacForm.create(formData);
    console.log('Novo formulário criado:', novoFormulario);
  } catch (error) {
    console.error('Erro ao criar o formulário:', error);
  }
}

// Função para processar os campos booleanos
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
      // Converta 'true', 'verdadeiro', 'sim' para 1
      if (['true', 'verdadeiro', 'sim'].includes(formData[field].toString().toLowerCase())) {
        formData[field] = 1;
      }
      // Converta 'false', 'falso', 'não' para 0
      else if (['false', 'falso', 'não'].includes(formData[field].toString().toLowerCase())) {
        formData[field] = 0;
      }
      // Se o valor for verdadeiro, defina como 1
      else if (formData[field] === true) {
        formData[field] = 1;
      }
      // Se o valor for falso, defina como 0
      else if (formData[field] === false) {
        formData[field] = 0;
      }
    }
  });

  return formData;
}

// Função para converter a data no formato dd/mm/yyyy para yyyy-mm-dd
function convertDate(dateStr) {
  // Verifica se a data está no formato correto dd/mm/yyyy
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  
  if (!match) {
    console.error('Data inválida:', dateStr);
    return '0000-00-00'; // Retorna uma data padrão inválida se o formato não for correto
  }

  const [_, day, month, year] = match;
  
  // Verifica se a data realmente existe (validação simples para evitar 'Invalid date')
  const date = new Date(`${year}-${month}-${day}`);
  
  // Verifica se a data construída é válida
  if (date.getDate() !== parseInt(day) || date.getMonth() + 1 !== parseInt(month) || date.getFullYear() !== parseInt(year)) {
    console.error('Data inválida:', dateStr);
    return '0000-00-00'; // Retorna uma data padrão inválida se a data for inválida
  }

  // Retorna a data no formato yyyy-mm-dd
  return `${year}-${month}-${day}`;
}





// Função para garantir que a hora tenha o formato correto hh:mm:ss
function convertTime(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  return `${hours}:${minutes}:00`;  // Adiciona os segundos como 00
}

// Função para processar os campos de data e hora antes de salvar no banco
function processDateAndTimeFields(formData) {
  if (formData.dataInicio) {
    formData.dataInicio = convertDate(formData.dataInicio); // Converte a data de início
  }
  if (formData.dataTermino) {
    formData.dataTermino = convertDate(formData.dataTermino); // Converte a data de término
  }
  if (formData.horaInicio) {
    formData.horaInicio = convertTime(formData.horaInicio); // Converte a hora de início
  }
  if (formData.horaTermino) {
    formData.horaTermino = convertTime(formData.horaTermino); // Converte a hora de término
  }
  return formData;
}


// Definição do modelo RacForm
const RacForm = sequelize.define('RacForm', {
  tecnico: { type: DataTypes.STRING },
  razaoSocial: { type: DataTypes.STRING },
  cnpj: { type: DataTypes.STRING },
  endereco: { type: DataTypes.STRING },
  numero: { type: DataTypes.STRING },
  responsavel: { type: DataTypes.STRING },
  setor: { type: DataTypes.STRING },
  cidade: { type: DataTypes.STRING },
  dataInicio: { type: DataTypes.DATE },
  horaInicio: { type: DataTypes.TIME },
  dataTermino: { type: DataTypes.DATE },
  horaTermino: { type: DataTypes.TIME },
  instalacaoDeEquipamentos: { type: DataTypes.BOOLEAN },
  manutencaoDeEquipamentos: { type: DataTypes.BOOLEAN },
  homologacaoDeInfra: { type: DataTypes.BOOLEAN },
  treinamentoOperacional: { type: DataTypes.BOOLEAN },
  implantacaoDeSistemas: { type: DataTypes.BOOLEAN },
  manutencaoPreventivaContratual: { type: DataTypes.BOOLEAN },
  repprintpoint2: { type: DataTypes.BOOLEAN },
  repprintpoint3: { type: DataTypes.BOOLEAN },
  repminiprint: { type: DataTypes.BOOLEAN },
  repsmart: { type: DataTypes.BOOLEAN },
  relogiomicropoint: { type: DataTypes.BOOLEAN },
  relogiobiopoint: { type: DataTypes.BOOLEAN },
  catracamicropoint: { type: DataTypes.BOOLEAN },
  catracabiopoint: { type: DataTypes.BOOLEAN },
  catracaceros: { type: DataTypes.BOOLEAN },
  catracaidblock: { type: DataTypes.BOOLEAN },
  catracaidnext: { type: DataTypes.BOOLEAN },
  idface: { type: DataTypes.BOOLEAN },
  idflex: { type: DataTypes.BOOLEAN },
  nSerie: { type: DataTypes.STRING },
  localInstalacao: { type: DataTypes.STRING },
  observacaoProblemas: { type: DataTypes.STRING },
  componente: { type: DataTypes.STRING },
  codigoComponente: { type: DataTypes.STRING },
  observacoes: { type: DataTypes.STRING },
  prestadoraDoServico: { type: DataTypes.STRING },
}, {
  tableName: 'RacForm',
  timestamps: false,  // Caso você não tenha colunas de createdAt e updatedAt
});

// Exportar tanto o sequelize quanto o modelo RacForm
module.exports = { RacForm, sequelize, createRacForm };
