// Importar módulos necessários
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require ('cors')

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
const db = mysql.createConnection({
  host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'racvirtual'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados');
});

// registrar um novo usuário
const registerUser = (db, usuario, senha) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)";
    db.query(sql, [usuario, senha], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// verificar se o usuário já está cadastrado
const verifyUser = (db, usuario) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM usuarios WHERE usuario = ?";
    db.query(sql, [usuario], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0); // Retorna verdadeiro se  resultado tiver registro
    });
  });
};

// Função para verificar se o usuário existe e se a senha está correta
const verifyUserWithPassword = (db, usuario, senha) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?";
    db.query(sql, [usuario, senha], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0);
    });
  });
};

app.post("/register", async (req, res) => {
  const { usuario, senha } = req.body;
  console.log("Dados recebidos para cadastro:", { usuario, senha });

  try {
    const usuarioExists = await verifyUser(db, usuario);
    console.log("Verificação de existência do usuário:", usuarioExists);

    if (usuarioExists) {
      return res.status(400).send("Usuário já está em uso.");
    }

    await registerUser(db, usuario, senha);
    res.send("Registro realizado com sucesso.");
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).send("Erro ao registrar.");
  }
});

// Rota para login
app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const userExists = await verifyUserWithPassword(db, usuario, senha);
    if (userExists) {
      res.send({ existe: true });
    } else {
      res.status(401).send("Usuário ou senha incorretos.");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send("Erro ao fazer login.");
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Login Servidor rodando na porta ${port}`);
});
