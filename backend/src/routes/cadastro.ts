import express, { Request, Response } from 'express';
import db from '../database/dbIndex.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

interface CadastroRequest {
  tipo: 'produtor' | 'empresa' | 'administrador';
  email: string;
  senha: string;

  nomeCompleto?: string;
  cpfCnpj?: string;
  localizacao?: string;
  tipoAtividade?: string;

  nomeEmpresa?: string;
  cnpj?: string;
  representante?: string;

  nome?: string;
  codigoVerificacao?: string;
}

router.post('/', async (req: Request<{}, {}, CadastroRequest>, res: Response) => {
  const { tipo, senha, email } = req.body;

  if (!tipo || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    let usuario: any = { tipo, email, senha: hashedSenha };

    switch (tipo) {
      case 'produtor': {
        const { nomeCompleto, cpfCnpj, localizacao, tipoAtividade } = req.body;
        if (!nomeCompleto || !cpfCnpj || !localizacao || !tipoAtividade) {
          return res.status(400).json({ error: 'Preencha todos os campos do produtor.' });
        }
        usuario = { ...usuario, nomeCompleto, cpfCnpj, localizacao, tipoAtividade };
        break;
      }

      case 'empresa': {
        const { nomeEmpresa, cnpj, representante } = req.body;
        if (!nomeEmpresa || !cnpj || !representante) {
          return res.status(400).json({ error: 'Preencha todos os campos da empresa.' });
        }
        usuario = { ...usuario, nomeEmpresa, cnpj, representante };
        break;
      }

      case 'administrador': {
        const { nome, codigoVerificacao } = req.body;
        if (!nome || !codigoVerificacao) {
          return res.status(400).json({ error: 'Preencha todos os campos do administrador.' });
        }
        usuario = { ...usuario, nome, codigoVerificacao };
        break;
      }

      default:
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    await db.insert('usuarios', usuario);

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

export default router;
