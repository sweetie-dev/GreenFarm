// routes/creditos.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// validação simples
function validarRegistro(body) {
  const errors = [];
  if (body.produtor_id == null || !Number.isInteger(body.produtor_id)) {
    errors.push('produtor_id é obrigatório e deve ser inteiro.');
  }
  const qtd = Number(body.quantidade);
  if (!body.quantidade || isNaN(qtd) || qtd <= 0) {
    errors.push('quantidade é obrigatória e deve ser número > 0.');
  }
  if (!body.origem || typeof body.origem !== 'string') {
    errors.push('origem é obrigatória.');
  }
  if (!body.data) {
    errors.push('data é obrigatória (YYYY-MM-DD).');
  } else {
    const d = new Date(body.data);
    if (isNaN(d.getTime())) errors.push('data inválida. Use YYYY-MM-DD.');
  }
  return errors;
}

// POST /creditos/registrar
router.post('/registrar', async (req, res) => {
  try {
    const body = req.body;
    const errors = validarRegistro(body);
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const sql = `INSERT INTO creditos (produtor_id, quantidade, origem, data)
                 VALUES (?, ?, ?, ?)`;
    const params = [body.produtor_id, body.quantidade, body.origem, body.data];

    const [result] = await pool.execute(sql, params);
    const insertedId = result.insertId;

    // buscar registro inserido para retornar
    const [rows] = await pool.execute('SELECT * FROM creditos WHERE id = ?', [insertedId]);

    return res.status(201).json({ ok: true, credit: rows[0] });
  } catch (err) {
    console.error('Erro registrar crédito:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno do servidor' });
  }
});

// GET /creditos - listar (com paginação simples)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '20'));
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute('SELECT * FROM creditos ORDER BY criado_em DESC LIMIT ? OFFSET ?', [limit, offset]);
    return res.json({ ok: true, data: rows, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Erro interno' });
  }
});

// GET /creditos/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: 'id inválido' });
    const [rows] = await pool.execute('SELECT * FROM creditos WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Crédito não encontrado' });
    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Erro interno' });
  }
});

module.exports = router;
