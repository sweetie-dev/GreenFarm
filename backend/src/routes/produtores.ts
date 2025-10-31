import type Express from 'express';
import { Produtores } from '../database/dbIndex';
import type { Produtor } from '../types/routesTypes';

const produtoresRoutes = [
    // Listar todos os produtores (para empresas verem)
    {
        endpoint: "/api/produtores",
        method: "get",
        run: async (_req: Express.Request, res: Express.Response) => {
            try {
                const produtores = Produtores.getAll();
                
                // Remover senhas
                const produtoresSemSenha = produtores.map((p: Produtor) => {
                    const { senhaHash, ...resto } = p;
                    return resto;
                });

                return res.json({ 
                    sucesso: true, 
                    produtores: produtoresSemSenha 
                });
            } catch (error) {
                return res.status(500).json({ erro: 'Erro ao listar produtores' });
            }
        }
    },
    
    // Obter detalhes de um produtor específico
    {
        endpoint: "/api/produtores/:id",
        method: "get",
        run: async (req: Express.Request, res: Express.Response) => {
            const { id } = req.params;
            
            const produtor = Produtores.get((p: Produtor) => 
                p.email === id || p.cpfOuCnpj === id
            );

            if (!produtor) {
                return res.status(404).json({ erro: 'Produtor não encontrado' });
            }

            const { senhaHash, ...produtorSemSenha } = produtor;
            
            return res.json({ 
                sucesso: true, 
                produtor: produtorSemSenha 
            });
        }
    }
];

export default produtoresRoutes;
