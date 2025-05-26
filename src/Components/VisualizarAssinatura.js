import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VisualizarAssinatura = ({ racId }) => {
  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssinatura = async () => {
      if (!racId) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`http://process.env.REACT_APP_API_URL:3000/racvirtual/assinatura/${racId}`);
        setAssinatura(response.data.assinatura);
      } catch (err) {
        console.error('Erro ao carregar assinatura:', err);
        setError('Não foi possível carregar a assinatura');
      } finally {
        setLoading(false);
      }
    };

    fetchAssinatura();
  }, [racId]);

  if (loading) return <div>Carregando assinatura...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!assinatura) return <div>Nenhuma assinatura encontrada</div>;

  return (
    <div className="assinatura-container">
      <h3>Assinatura Digital</h3>
      <div className="assinatura-imagem">
        <img 
          src={assinatura} 
          alt="Assinatura digital" 
          style={{ maxWidth: '100%', border: '1px solid #ddd' }}
        />
      </div>
    </div>
  );
};

export default VisualizarAssinatura;