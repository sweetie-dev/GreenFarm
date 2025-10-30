import express, { Request, Response } from 'express';
import db from '../database/dbIndex.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

interface LoginRequest {
  email: string;
  senha: string;
}

router.post('/', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const resultados = await db.find('usuarios', { email });
    if (!resultados || resultados.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const user = resultados[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      tipo: user.tipo,  
      user: { ...user, senha: undefined } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

export default router;
