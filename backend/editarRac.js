const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'racvirtual',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const app = express();
const PORT = 3006;

// Configuração do CORS
app.use(cors()); // Permite requisições de qualquer origem

// Middleware para tratar JSON
app.use(express.json());

// Endpoint GET para buscar a RAC pelo ID
app.get('/racvirtual/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT * FROM racform WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'RAC não encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar a RAC:', error.message, error.stack);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// Endpoint PUT para editar a RAC
app.put('/racvirtual/edit/:id', async (req, res) => {
    const { id } = req.params;
    const {
        tecnico, razaoSocial, cnpj, endereco, numero, responsavel, setor, cidade, horaInicio, horaTermino,
        instalacaoDeEquipamentos, manutencaoDeEquipamentos, homologacaoDeInfra, treinamentoOperacional, 
        implantacaoDeSistemas, manutencaoPreventivaContratual, repprintpoint, repminiprint, repsmart, 
        relogiomicropoint, relogiobiopoint, catracamicropoint, catracabiopoint, catracaceros, catracaidblock, 
        catracaidnext, idface, idflex, nSerie, localinstalacao, observacaoproblemas, componente, codigocomponente, 
        observacoes, date
    } = req.body;

    // Exibe os valores recebidos para depuração
    console.log('ID:', id);
    console.log('Dados recebidos:', req.body);

    // Lista de campos obrigatórios
    const requiredFields = [
        tecnico, razaoSocial, cnpj, endereco, numero, responsavel, setor, cidade, horaInicio, horaTermino
    ];

    // Verifica se todos os campos obrigatórios foram enviados
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Formata a data para o formato correto (YYYY-MM-DD HH:mm:ss)
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

    const updateQuery = `
    UPDATE racform
    SET tecnico = ?, razaoSocial = ?, cnpj = ?, endereco = ?, numero = ?, responsavel = ?, setor = ?, cidade = ?, 
        horaInicio = ?, horaTermino = ?, instalacaoDeEquipamentos = ?, manutencaoDeEquipamentos = ?, homologacaoDeInfra = ?, 
        treinamentoOperacional = ?, implantacaoDeSistemas = ?, manutencaoPreventivaContratual = ?, repprintpoint = ?, 
        repminiprint = ?, repsmart = ?, relogiomicropoint = ?, relogiobiopoint = ?, catracamicropoint = ?, 
        catracabiopoint = ?, catracaceros = ?, catracaidblock = ?, catracaidnext = ?, idface = ?, idflex = ?, 
        nSerie = ?, localinstalacao = ?, observacaoproblemas = ?, componente = ?, codigocomponente = ?, 
        observacoes = ?, date = ?
    WHERE id = ?
`;

    const values = [
        tecnico, razaoSocial, cnpj, endereco, numero, responsavel, setor, cidade, horaInicio, horaTermino,
        instalacaoDeEquipamentos, manutencaoDeEquipamentos, homologacaoDeInfra, treinamentoOperacional, 
        implantacaoDeSistemas, manutencaoPreventivaContratual, repprintpoint, repminiprint, repsmart, 
        relogiomicropoint, relogiobiopoint, catracamicropoint, catracabiopoint, catracaceros, catracaidblock, 
        catracaidnext, idface, idflex, nSerie, localinstalacao, observacaoproblemas, componente, codigocomponente, 
        observacoes, formattedDate, id
    ];

    try {
        // Executa a query de atualização
        const [result] = await db.execute(updateQuery, values);

        // Verifica se a atualização foi bem-sucedida
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'RAC não encontrada' });
        }

        // Retorna sucesso
        res.status(200).json({ message: 'RAC editada com sucesso' });
    } catch (error) {
        console.error('Erro ao editar RAC:', error.message, error.stack);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
