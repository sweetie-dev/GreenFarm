import type Express from 'express';
import { Produtores, Empresas } from '../../../database/dbIndex';
import type { Produtor, Empresa } from '../../../types/routesTypes';

const saldoRoutes = [
  {
    endpoint: "/api/dashboard/saldo/:id",
    method: "get",
    run: async (req: Express.Request, res: Express.Response) => {
      const { id } = req.params;

      try {
        // Tentar encontrar como produtor
        let usuario = Produtores.get((p: Produtor) => p.email === id || p.cpfOuCnpj === id);
        
        // Se não encontrar, tentar como empresa
        if (!usuario) {
          usuario = Empresas.get((e: Empresa) => e.emailEmpresa === id || e.cnpj === id);
        }

        if (!usuario) {
          return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        return res.json({ 
          sucesso: true,
          saldo: usuario.creditos || 0 
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao buscar saldo.' });
      }
    }
  }
];

export default saldoRoutes;

