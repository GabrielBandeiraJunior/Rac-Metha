import React from 'react';
import Login from './Login.js';
import Register from './Register.js';
import './Autenticacao.css';
import Headers from './Components/Headers.js'

export default function Autenticacao() {
    const links = [
        { label: 'Perfil', url: '/perfil' },
        { label: 'Home', url: '/' }
      ]
    return (
        <>
         <Headers links={links} />

            <div className="ContainersWrapper"> {/* Corrigido para className */}
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
