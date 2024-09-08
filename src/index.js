import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth'; 
import Home from './Home';
import Login from './Login.js';
import Register from './Register.js';
import Registrar from './PaginaRegistrar.js';
import Perfil from './Perfil.js'
import RACForm from './RACForm.js'

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

const RoutesComponent = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<ProtectedRoute element={<Perfil />} />} />
        <Route path="/rac" element={<ProtectedRoute element={<RACForm />} />} />
        <Route path="/registrar" element={<Registrar />} />
      
        {/* Outras rotas podem ser adicionadas aqui */}
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
