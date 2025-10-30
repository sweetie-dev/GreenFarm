
import express, { Request, Response } from 'express';
import pool from '../database/dbIndex.js';
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
    const [produtorRows]: any = await pool.execute(
      'SELECT * FROM produtores WHERE email = ?',
      [email]
    );
    const [empresaRows]: any = await pool.execute(
      'SELECT * FROM empresas WHERE email = ?',
      [email]
    );
    const [adminRows]: any = await pool.execute(
      'SELECT * FROM administradores WHERE email = ?',
      [email]
    );

    let user: any = null;
    let tipo = '';

    if (produtorRows.length) {
      user = produtorRows[0];
      tipo = 'produtor';
    } else if (empresaRows.length) {
      user = empresaRows[0];
      tipo = 'empresa';
    } else if (adminRows.length) {
      user = adminRows[0];
      tipo = 'administrador';
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    return res.status(200).json({ message: 'Login realizado com sucesso!', tipo, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

export default router;
