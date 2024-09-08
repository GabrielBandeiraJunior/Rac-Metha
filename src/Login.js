import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from './auth'; // Importe o hook de autenticação

//testeee
function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Desestrutura a função de login do contexto

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        usuario,
        senha,
      });

      if (response.data.existe) {
        login('some-auth-token'); // Atualiza o estado de autenticação
        navigate("/perfil"); // Redireciona para a rota /perfil
      } else {
        alert("Email ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="usuario"
        placeholder="usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="senha"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;



// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "./auth"; // Certifique-se de que o caminho está correto

// function Login() {
//   const [usuario, setUsuario] = useState(""); 
//   const [senha, setSenha] = useState(""); 
//   const [erro, setErro] = useState(""); 
//   const { login } = useAuth(); // Obtém a função login do contexto

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErro(""); // Limpa a mensagem de erro

//     try {
//       const response = await axios.post("http://localhost:3001/login", {
//         usuario,
//         senha,
//       });

//       if (response.data.existe) {
     
//         const token = response.data.token; 
//         login(token);
//         alert("Login realizado com sucesso!");
     
//       } else {
//         setErro("Usuário ou senha incorretos.");
//       }
//     } catch (error) {
//       console.error("Erro ao fazer login:", error);
//       if (error.response && error.response.status === 401) {
//         setErro("Usuário ou senha incorretos.");
//       } else {
//         setErro("Erro ao fazer login. Tente novamente mais tarde.");
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Usuário"
//         value={usuario}
//         onChange={(e) => setUsuario(e.target.value)} 
//       />
//       <input
//         type="password"
//         placeholder="Senha"
//         value={senha}
//         onChange={(e) => setSenha(e.target.value)}
//       />
//       <button type="submit">Login</button>
//       {erro && <p style={{ color: "red" }}>{erro}</p>}
//     </form>
//   );
// }

// export default Login;
