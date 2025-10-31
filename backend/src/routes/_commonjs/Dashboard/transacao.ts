import express, { Request, Response } from 'express';
import db from '../../../database/dbIndex.js';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await db.get(`usuarios.${id}`);
    if (!user || !user.transacoes) {
      return res.status(404).json({ error: 'Usuário ou transações não encontradas' });
    }
    
    const ultimas = user.transacoes.slice(-5).reverse();
    return res.json(ultimas); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar transações' }); 
  }
});

export default router;