import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth'; 
import Home from './Home';
import Register from './Register.js';
import Perfil from './Perfil.js'
import RACForm from './RACForm.js'
import RacsCadastradas from './RacsCadastradas.js';
import Autenticacao from './Autenticacao.js';
import ImportarPlanilha from './ImportarPlanilha.js';


const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/autenticacao" />;
};

const RoutesComponent = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/perfil" element={<ProtectedRoute element={<Perfil />} />} />
        <Route path="/novarac" element={<ProtectedRoute element={<RACForm />} />} />
        {/* <Route path="/registrar" element={<Registrar />} /> */}
        <Route path="/RacsCadastradas" element={<ProtectedRoute element={<RacsCadastradas />} />}/>
        {/* Outras rotas podem ser adicionadas aqui */}
        <Route path="/Autenticacao" element={<Autenticacao />} />
        <Route path="/Racscadastradas" element={<RacsCadastradas />}/>
        <Route path="/importarplanilha" element={<ProtectedRoute element={<ImportarPlanilha />} />} />


      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RoutesComponent />
  </React.StrictMode>
);
