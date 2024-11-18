import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from './auth'; // Importe o hook de autenticação
import './my-button.css'

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Desestrutura a função de login do contexto
  
  const links = [
    { label: 'Autenticacao', url: '/Autenticacao' }
  ]
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

  return (<>
    

    <form onSubmit={handleSubmit}>
      <input
        type="usuario"
        placeholder="usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        
      /><br/>

      <input
        type="senha"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      /><br/>

      <button type="submit" className="styled-button">Login</button>
    </form>
    </>  );
}

export default Login;