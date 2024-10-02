import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

// import Login from './Login.js'
// import Register from './Register.js'
import RacForm from './RACForm.js'

export default function Home() {
  return (
    <div>
      <h1> Home </h1>
      
      
      <Link to="/Login">LOGIN</Link> <br/>
      <Link to="/Register">REGISTER</Link> <br/>
      <Link to="/rac">RAc</Link> <br/>
      <Link to="/perfil">Meu Perfil</Link><br/>
      <Link to="/racscadastradas">racscadastradas</Link>
      
    </div>
  );
}
