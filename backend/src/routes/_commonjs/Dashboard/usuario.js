const expless = require('express');
const router = expless.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT id, nome, email, saldo FROM usuarios WHERE id = ?', [id]);
        if (!rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar usuário ' });
    }
});

module.exports = router;
