import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './EmpresasManager.css';

const EmpresasManager = () => {
  const [empresas, setEmpresas] = useState([]);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    Nome: '',
    CNPJ: '',
    Cidade: '',
    Endereço: '',
    numero: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar todas as empresas
  const fetchEmpresas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submeter formulário (criar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmpresa) {
        await axios.put(`http://localhost:3000/empresas/${editingEmpresa.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/empresas', formData);
      }
      fetchEmpresas();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
    }
  };

  // Editar empresa
  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      Nome: empresa.Nome,
      CNPJ: empresa.CNPJ,
      Cidade: empresa.Cidade,
      Endereço: empresa.Endereço,
      Bairro: empresa.Bairro,
      Fone: empresa.Fone,
    });
  };

  // Deletar empresa
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta empresa?')) {
      try {
        await axios.delete(`http://localhost:3000/empresas/${id}`);
        fetchEmpresas();
      } catch (error) {
        console.error('Erro ao deletar empresa:', error);
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      Nome: '',
      CNPJ: '',
      Cidade: '',
      Endereço: '',
      numero: ''
    });
    setEditingEmpresa(null);
  };

  // Filtrar empresas
  const filteredEmpresas = empresas.filter(empresa =>
    empresa.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.CNPJ.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="empresas-container">
      <h2>Gerenciamento de Empresas</h2>
      
      {/* Formulário para adicionar/editar */}
      <motion.div 
        className="empresa-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3>{editingEmpresa ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome/Razão Social:</label>
            <input
              type="text"
              name="Nome"
              value={formData.Nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nome Fantasia:</label>
            <input
              type="text"
              name="Fantasia"
              value={formData.Fantasia}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>CNPJ:</label>
            <input
              type="text"
              name="CNPJ"
              value={formData.CNPJ}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cidade:</label>
            <input
              type="text"
              name="Cidade"
              value={formData.Cidade}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Endereço:</label>
            <input
              type="text"
              name="Endereço"
              value={formData.Endereço}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bairro:</label>
            <input
              type="text"
              name="Bairro"
              value={formData.Bairro}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Fone:</label>
            <input
              type="text"
              name="Fone"
              value={formData.Fone}
              onChange={handleChange}
            />
          </div>
          
          
          
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingEmpresa ? 'Atualizar' : 'Salvar'}
            </button>
            {editingEmpresa && (
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </motion.div>
      
      {/* Lista de empresas */}
      <div className="empresas-list">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Fantasia</th>
                <th>CNPJ</th>
                <th>Cidade</th>
                <th>Endereço</th>
                <th>Bairro</th>
                <th>Fone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.map(empresa => (
                <motion.tr
                  key={empresa.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td>{empresa.Nome}</td>
                  <td>{empresa.Fantasia}</td>
                  <td>{empresa.CNPJ}</td>
                  <td>{empresa.Cidade}</td>
                  <td>{empresa.Endereço}</td>
                  <td>{empresa.Bairro}</td>
                  <td>{empresa.Fone}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(empresa)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(empresa.id)}
                      className="btn-delete"
                    >
                      Deletar
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmpresasManager;