// Backend - editarracs.js
const editarRac = async (req, res) => {
    const { id } = req.params;
    const { tecnico, razaoSocial, cnpj, endereco, cidade, setor } = req.body;

    if (!tecnico || !razaoSocial || !cnpj || !endereco || !cidade || !setor) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const query = `
        UPDATE racvirtual
        SET tecnico = ?, razaoSocial = ?, cnpj = ?, endereco = ?, cidade = ?, setor = ?
        WHERE id = ?
    `;

    try {
        const [result] = await db.execute(query, [tecnico, razaoSocial, cnpj, endereco, cidade, setor, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'RAC não encontrada' });
        }

        res.status(200).json({ message: 'RAC editada com sucesso' });
    } catch (error) {
        console.error('Erro ao editar RAC:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};
