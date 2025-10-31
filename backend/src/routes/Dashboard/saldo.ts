import express, { Request, Response } from 'express';
import db from '../../database/dbIndex.js';

const router = express.Router();


router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await db.get(`usuarios.${id}`);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({ saldo: user.saldo || 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar saldo.' });
  }

  
});

export default router;
