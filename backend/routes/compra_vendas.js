const express = require('express');
const router = express.Router();
const pool = require('../db.js');

// Função simples de validação
function validarCompra(body) {
  const errors = [];

  if (!body.comprador_id || !Number.isInteger(body.comprador_id))
    errors.push('comprador_id é obrigatório e deve ser inteiro.');

  if (!body.vendedor_id || !Number.isInteger(body.vendedor_id))
    errors.push('vendedor_id é obrigatório e deve ser inteiro.');

  if (!body.credito_id || !Number.isInteger(body.credito_id))
    errors.push('credito_id é obrigatório e deve ser inteiro.');

  const qtd = Number(body.quantidade);
  if (isNaN(qtd) || qtd <= 0)
    errors.push('quantidade deve ser número maior que 0.');

  const valor = Number(body.valor);
  if (isNaN(valor) || valor <= 0)
    errors.push('valor deve ser número maior que 0.');

  return errors;
}

// POST /compras/registrar
router.post('/registrar', async (req, res) => {
  try {
    const body = req.body;
    const errors = validarCompra(body);
    if (errors.length > 0)
      return res.status(400).json({ ok: false, errors });

    const sql = `
      INSERT INTO compras_vendas 
      (comprador_id, vendedor_id, credito_id, quantidade, valor)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      body.comprador_id,
      body.vendedor_id,
      body.credito_id,
      body.quantidade,
      body.valor
    ];

    const [result] = await pool.execute(sql, params);
    const [rows] = await pool.execute('SELECT * FROM compras_vendas WHERE id = ?', [result.insertId]);

    return res.status(201).json({ ok: true, transacao: rows[0] });

  } catch (err) {
    console.error('Erro ao registrar compra/venda:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno do servidor' });
  }
});

// GET /compras
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM compras_vendas ORDER BY data DESC');
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('Erro ao listar compras/vendas:', err);
    res.status(500).json({ ok: false, error: 'Erro interno do servidor' });
  }
});

module.exports = router;