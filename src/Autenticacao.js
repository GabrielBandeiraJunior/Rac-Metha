import React from 'react';
import Register from './Register.js';
import Login from './Login.js';
import './Autenticacao.css';
import Headers from './Components/Headers.js'
const API_URL = process.env.REACT_APP_API_URL;
export default function Autenticacao() {
    const links = [
        { label: 'Autenticacao', url: '/Autenticacao' },
        { label: 'Perfil', url: '/perfil' },
        { label: 'Consultar Racs', url: '/racscadastradas' },
        { label: 'Cadastrar RAC', url: '/novarac' },
        { label: 'Importar Planilha', url: '/importarplanilha' },
        { label: 'Home', url: '/' },
      ]
    return (
        <>
         <Headers links={links} />

            <div className="ContainersWrapper">
                <div className="Container">
                    <h1>Registro</h1>
                    <Register />
                </div>
                <div className="Container2">
                    <h1>Login</h1>
                    <Login />
                </div>
                
            </div>
        </>
    );
}
