const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT saldo from usuarios WHERE id = ?', [id]);
        if (!rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ saldo: rows[0].saldo });
    } catch (error) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar saldo ' });
    }
})

module.exports = router;