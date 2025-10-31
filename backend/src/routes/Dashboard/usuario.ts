import express, { Request, Response } from 'express';
import db from '../../database/dbIndex.js';

const router = express.Router();

interface Transacao {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  saldo: number;
  transacoes?: Transacao[];
}

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = db.get(`usuarios.${id}`) as Usuario | undefined;

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const transacoes = Array.isArray(user.transacoes) ? user.transacoes : [];
    const ultimas = transacoes.slice(-5).reverse();
    return res.json(ultimas);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

export default router;
