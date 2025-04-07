const express = require('express');
const mysql = require('mysql2/promise'); // Usando promises
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'racvirtual'
};

// Criar tabela de usuários segura
const createUsersTable = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      usuario VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      perfil ENUM('admin', 'tecnico') DEFAULT 'tecnico',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Conexão com o banco e inicialização
let db;
mysql.createConnection(dbConfig)
  .then(connection => {
    db = connection;
    createUsersTable(db);
    console.log('Conectado ao banco de dados MySQL');
    
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco:', err);
    process.exit(1);
  });

// Rotas de autenticação
app.post("/register", async (req, res) => {
  const { nome, usuario, senha } = req.body;
  console.log("Tentativa de registro:", { usuario, nome }); // Log inicial

  try {
    // Verifica se usuário já existe
    const [users] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (users.length > 0) {
      console.log("Falha no registro: usuário já existe");
      return res.status(400).json({ 
        success: false,
        error: "Usuário já está em uso" 
      });
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    // Insere novo usuário
    await db.query(
      'INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)',
      [nome, usuario, hashedPassword]
    );

    console.log("Registro bem-sucedido para:", usuario);
    res.status(201).json({ 
      success: true,
      message: "Registro realizado com sucesso",
      user: { nome, usuario }
    });
  } catch (error) {
    console.error("Erro durante o registro:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno no servidor",
      details: error.message
    });
  }
});

app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;
  console.log("Tentativa de login recebida:", { usuario });

  try {
    console.log("Buscando usuário no banco de dados...");
    const [users] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    
    if (users.length === 0) {
      console.log("Usuário não encontrado no banco de dados");
      return res.status(401).json({ 
        success: false,
        error: "Usuário não encontrado" 
      });
    }

    const user = users[0];
    console.log("Usuário encontrado, verificando senha...");
    const validPassword = await bcrypt.compare(senha, user.senha);
    
    if (!validPassword) {
      console.log("Senha não corresponde");
      return res.status(401).json({ 
        success: false,
        error: "Senha incorreta" 
      });
    }

    console.log("Credenciais válidas, gerando token...");
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, nome: user.nome },
      process.env.JWT_SECRET || 'sua_chave_secreta',
      { expiresIn: '8h' }
    );

    console.log("Login concluído com sucesso para:", usuario);
    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario
      }
    });

  } catch (error) {
    console.error("Erro durante o processamento do login:", {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    res.status(500).json({ 
      success: false,
      error: "Erro interno no servidor"
    });
  }
});

// Rota protegida de exemplo
app.get("/user-info", authenticateToken, async (req, res) => {
  res.json(req.user);
});