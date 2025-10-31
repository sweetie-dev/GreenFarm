import express, { Request, Response } from 'express';
import db from '../../database/dbIndex.js';

const router = express.Router();

interface Credito {
  id: number;
  produtor_id: number;
  quantidade: number;
  origem: string;
  data: string; 
  criado_em: string;
}

function validarRegistro(body: any): string[] {
  const errors: string[] = [];
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


router.post('/registrar', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const errors = validarRegistro(body);
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const creditos: Credito[] = db.get('creditos') || [];

    
    const newId = creditos.length ? Math.max(...creditos.map(c => c.id)) + 1 : 1;

    const novoCredito: Credito = {
      id: newId,
      produtor_id: body.produtor_id,
      quantidade: body.quantidade,
      origem: body.origem,
      data: body.data,
      criado_em: new Date().toISOString(),
    };

    creditos.push(novoCredito);
    db.set('creditos', creditos);

    return res.status(201).json({ ok: true, credit: novoCredito });
  } catch (err) {
    console.error('Erro registrar crédito:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno do servidor' });
  }
});


router.get('/', (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1'));
    const limit = Math.min(100, parseInt(req.query.limit as string || '20'));
    const offset = (page - 1) * limit;

    const creditos: Credito[] = db.get('creditos') || [];


    const sorted = [...creditos].sort((a, b) => b.criado_em.localeCompare(a.criado_em));
    const data = sorted.slice(offset, offset + limit);

    return res.json({ ok: true, data, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Erro interno' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: 'id inválido' });

    const creditos: Credito[] = db.get('creditos') || [];
    const credito = creditos.find(c => c.id === id);

    if (!credito) return res.status(404).json({ ok: false, error: 'Crédito não encontrado' });

    return res.json({ ok: true, data: credito });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Erro interno' });
  }
});

export default router;
