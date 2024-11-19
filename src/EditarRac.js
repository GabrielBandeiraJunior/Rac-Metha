import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditarRac({ idRac, onSave, onCancel }) {
    const [rac, setRac] = useState(null); // Estado para armazenar os dados da RAC
    const [error, setError] = useState(null); // Estado para erros

    // Buscar os dados da RAC pelo ID ao carregar o componente
    useEffect(() => {
        if (!idRac) {
            setError('ID da RAC inválido.');
            return;
        }

        const fetchRac = async () => {
            try {
                const response = await axios.get(`http://localhost:3006/racvirtual/${idRac}`);
                setRac(response.data);
            } catch (err) {
                console.error('Erro ao carregar a RAC:', err);
                setError('Erro ao carregar os dados da RAC.');
            }
        };

        fetchRac();
    }, [idRac]);

    // Função para tratar mudanças nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRac((prevRac) => ({ ...prevRac, [name]: value }));
    };

    // Função para salvar as alterações
    const handleSave = async () => {
        if (!rac) return;

        // Validação de campos obrigatórios
        if (!rac.tecnico || !rac.razaoSocial || !rac.cnpj || !rac.endereco || !rac.cidade || !rac.setor) {
            setError('Todos os campos obrigatórios devem ser preenchidos.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3006/racvirtual/edit/${idRac}`, rac);
            console.log(response.data); // Para depuração
            onSave(); // Callback para ações após salvar
        } catch (err) {
            console.error('Erro ao salvar alterações:', err);
            setError('Erro ao salvar as alterações.');
        }
    };

    // Caso ocorra um erro
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    // Exibe uma mensagem de carregamento enquanto os dados não estão disponíveis
    if (!rac) {
        return <p>Carregando dados da RAC...</p>;
    }

    return (
        <div>
            <h1>Editar RAC</h1>
            <form>
                <label>
                    Técnico:
                    <input
                        type="text"
                        name="tecnico"
                        value={rac.tecnico || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Razão Social:
                    <input
                        type="text"
                        name="razaoSocial"
                        value={rac.razaoSocial || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    CNPJ:
                    <input
                        type="text"
                        name="cnpj"
                        value={rac.cnpj || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Endereço:
                    <input
                        type="text"
                        name="endereco"
                        value={rac.endereco || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Cidade:
                    <input
                        type="text"
                        name="cidade"
                        value={rac.cidade || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Setor:
                    <input
                        type="text"
                        name="setor"
                        value={rac.setor || ''}
                        onChange={handleChange}
                    />
                </label>
                <button type="button" onClick={handleSave}>
                    Salvar
                </button>
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}
