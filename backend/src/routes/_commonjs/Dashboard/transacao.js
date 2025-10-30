const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT tipo, descricao, valor, data FROM transacoes WHERE usuario_id = ? ORDER BY data DESC LIMIT 5', [id]);
        res.json(rows);
    } catch (error) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar transações ' });
    }
});

module.exports = router;