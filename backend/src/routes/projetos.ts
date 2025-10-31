import type Express from 'express';
import { Projetos, Produtores } from '../database/dbIndex';
import type { Projeto, Produtor } from '../types/routesTypes';

const projetosRoutes = [
    {
        endpoint: "/api/projetos",
        method: "post",
        run: async (req: Express.Request, res: Express.Response) => {
            const { produtorId, nome, descricao } = req.body;

            if (!produtorId || !nome) {
                return res.status(400).json({ erro: "Produtor ID e nome são obrigatórios" });
            }

            const produtor = Produtores.get((p: Produtor) => p.email === produtorId || p.cpfOuCnpj === produtorId);
            if (!produtor) {
                return res.status(404).json({ erro: "Produtor não encontrado" });
            }

            const novoProjeto: Projeto = {
                id: Date.now().toString(),
                produtorId: produtorId,
                nome: nome,
                descricao: descricao || '',
                progresso: 0,
                creditosEsperados: 0,
                finalizado: false,
                criadoEm: new Date().toISOString()
            };

            Projetos.create(novoProjeto);

            // Atualizar relacionamento com produtor
            Produtores.update(
                (p: Produtor) => p.email === produtorId || p.cpfOuCnpj === produtorId,
                (p: Produtor) => {
                    if (!p.projetos) p.projetos = [];
                    p.projetos.push(novoProjeto.id);
                    return p;
                }
            );

            return res.status(201).json({ 
                sucesso: true, 
                projeto: novoProjeto 
            });
        }
    },
    {
        endpoint: "/api/projetos/:produtorId",
        method: "get",
        run: async (req: Express.Request, res: Express.Response) => {
            const { produtorId } = req.params;

            const projetos = Projetos.getMany((p: Projeto) => p.produtorId === produtorId);

            return res.status(200).json({ 
                sucesso: true, 
                projetos: projetos 
            });
        }
    },
    {
        endpoint: "/api/projetos/:id",
        method: "put",
        run: async (req: Express.Request, res: Express.Response) => {
            const { id } = req.params;
            const { progresso, creditosEsperados, finalizado } = req.body;

            const projeto = Projetos.get((p: Projeto) => p.id === id);
            if (!projeto) {
                return res.status(404).json({ erro: "Projeto não encontrado" });
            }

            // Atualizar projeto
            Projetos.update(
                (p: Projeto) => p.id === id,
                (p: Projeto) => {
                    if (progresso !== undefined) p.progresso = progresso;
                    if (creditosEsperados !== undefined) p.creditosEsperados = creditosEsperados;
                    if (finalizado !== undefined) p.finalizado = finalizado;
                    return p;
                }
            );

            // Atualizar objeto local para retornar
            if (progresso !== undefined) projeto.progresso = progresso;
            if (creditosEsperados !== undefined) projeto.creditosEsperados = creditosEsperados;
            if (finalizado !== undefined) projeto.finalizado = finalizado;

            return res.status(200).json({ 
                sucesso: true, 
                projeto: projeto 
            });
        }
    }
];

export default projetosRoutes;
