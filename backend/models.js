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
  
    try {
      // Inserir dados processados na tabela
      const novoFormulario = await RacForm.create(formData);
      console.log('Novo formulário criado:', novoFormulario);
    } catch (error) {
      console.error('Erro ao criar o formulário:', error);
    }
  }

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
module.exports = { RacForm, sequelize };
