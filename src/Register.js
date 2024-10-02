import React, { useState , navigate} from "react";
import axios from "axios";

function Register() {
  const [usuario, setUsuario] = useState(""); // Estado para 'usuario'
  const [senha, setSenha] = useState(""); // Estado para 'password'

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/register", {
        usuario,
        senha,
      });
      alert("Registro realizado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Usuário já está em uso!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)} 
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button type="submit">Registrar</button>
    </form>
  );
}

export default Register;
