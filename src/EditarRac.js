import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditarRac({ idRac, onSave, onCancel }) {
    const [rac, setRac] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRac = async () => {
            try {
                const response = await axios.get(`http://localhost:3004/racvirtual/${idRac}`);
                setRac(response.data);
            } catch (err) {
                setError('Erro ao carregar a RAC');
            }
        };

        fetchRac();
    }, [idRac]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRac((prevRac) => ({ ...prevRac, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3004/racvirtual/edit/${idRac}`, rac);
            onSave();
        } catch (err) {
            setError('Erro ao salvar alterações');
        }
    };

    if (error) {
        return <p style={{ color: 'red'}} >{error}</p>;
    }

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
                {/* Adicione mais campos aqui conforme necessário */}
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
