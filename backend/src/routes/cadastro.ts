import express, { Request, Response } from 'express';
import pool from '../database/dbIndex.js';
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

    switch (tipo) {
      case 'produtor': {
        const { nomeCompleto, cpfCnpj, localizacao, tipoAtividade } = req.body;
        if (!nomeCompleto || !cpfCnpj || !localizacao || !tipoAtividade) {
          return res.status(400).json({ error: 'Preencha todos os campos do produtor.' });
        }

        await pool.execute(
          'INSERT INTO produtores (nome_completo, cpf_cnpj, localizacao, tipo_atividade, email, senha) VALUES (?, ?, ?, ?, ?, ?)',
          [nomeCompleto, cpfCnpj, localizacao, tipoAtividade, email, hashedSenha]
        );
        break;
      }

      case 'empresa': {
        const { nomeEmpresa, cnpj, representante } = req.body;
        if (!nomeEmpresa || !cnpj || !representante) {
          return res.status(400).json({ error: 'Preencha todos os campos da empresa.' });
        }

        await pool.execute(
          'INSERT INTO empresas (nome_empresa, cnpj, representante, email, senha) VALUES (?, ?, ?, ?, ?)',
          [nomeEmpresa, cnpj, representante, email, hashedSenha]
        );
        break;
      }

      case 'administrador': {
        const { nome, codigoVerificacao } = req.body;
        if (!nome || !codigoVerificacao) {
          return res.status(400).json({ error: 'Preencha todos os campos do administrador.' });
        }

        await pool.execute(
          'INSERT INTO administradores (nome, email, senha, codigo_verificacao) VALUES (?, ?, ?, ?)',
          [nome, email, hashedSenha, codigoVerificacao]
        );
        break;
      }

      default:
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});


export default router;
