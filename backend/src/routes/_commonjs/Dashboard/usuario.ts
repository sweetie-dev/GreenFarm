import type Express from 'express';
import { Produtores, Empresas, Administradores } from '../../../database/dbIndex';
import type { Produtor, Empresa, Administrador } from '../../../types/routesTypes';

const usuarioRoutes = [
  {
    endpoint: "/api/dashboard/usuario/:id",
    method: "get",
    run: async (req: Express.Request, res: Express.Response) => {
      const { id } = req.params;

      try {
        // Tentar encontrar como produtor
        let usuario: any = Produtores.get((p: Produtor) => p.email === id || p.cpfOuCnpj === id);
        let tipo = 'produtor';
        
        // Se não encontrar, tentar como empresa
        if (!usuario) {
          usuario = Empresas.get((e: Empresa) => e.emailEmpresa === id || e.cnpj === id);
          tipo = 'empresa';
        }

        // Se não encontrar, tentar como admin
        if (!usuario) {
          usuario = Administradores.get((a: Administrador) => a.email === id);
          tipo = 'admin';
        }

        if (!usuario) {
          return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        // Remover senha do retorno
        const usuarioSemSenha = { ...usuario };
        delete usuarioSemSenha.senhaHash;

        return res.json({
          sucesso: true,
          usuario: usuarioSemSenha,
          tipo: tipo
        });

      } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao buscar usuário' });
      }
    }
  }
];

export default usuarioRoutes;

