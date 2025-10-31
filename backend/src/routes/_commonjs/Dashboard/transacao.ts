import type Express from 'express';
import { Transacoes } from '../../../database/dbIndex';
import type { Transacao } from '../../../types/routesTypes';

const transacaoRoutes = [
  {
    endpoint: "/api/dashboard/transacoes/:id",
    method: "get",
    run: async (req: Express.Request, res: Express.Response) => {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;
      
      try {
        const todasTransacoes = Transacoes.getMany((t: Transacao) => 
          t.empresaId === id || t.produtorId === id
        );
        
        if (!todasTransacoes || todasTransacoes.length === 0) {
          return res.json({ 
            sucesso: true,
            transacoes: [] 
          });
        }
        
        // Ordenar por data (mais recentes primeiro) e pegar as últimas
        const ultimas = todasTransacoes
          .sort((a: Transacao, b: Transacao) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, limit);
          
        return res.json({ 
          sucesso: true,
          transacoes: ultimas 
        }); 
      } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao buscar transações' }); 
      }
    }
  }
];

export default transacaoRoutes;
