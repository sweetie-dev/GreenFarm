import type Express from 'express';
import { RegistrosCredito, Produtores, Projetos } from '../../database/dbIndex';
import type { RegistroCredito, Produtor, Projeto } from '../../types/routesTypes';

const creditosRoutes = [
    {
        endpoint: "/api/creditos/registrar",
        method: "post",
        run: async (req: Express.Request, res: Express.Response) => {
            const { produtorId, projetoId, quantidade, data, observacao } = req.body;

            if (!produtorId || !quantidade || quantidade <= 0) {
                return res.status(400).json({ 
                    erro: "Produtor ID e quantidade válida são obrigatórios" 
                });
            }

            const produtor = Produtores.get((p: Produtor) => p.email === produtorId || p.cpfOuCnpj === produtorId);
            if (!produtor) {
                return res.status(404).json({ erro: "Produtor não encontrado" });
            }

            // Verificar projeto se informado
            if (projetoId) {
                const projeto = Projetos.get((p: Projeto) => p.id === projetoId);
                if (!projeto) {
                    return res.status(404).json({ erro: "Projeto não encontrado" });
                }
            }

            const novoRegistro: RegistroCredito = {
                id: Date.now().toString(),
                produtorId: produtorId,
                projetoId: projetoId || undefined,
                quantidade: Number(quantidade),
                data: data || new Date().toISOString().split('T')[0],
                observacao: observacao || '',
                status: 'pendente',
                criadoEm: new Date().toISOString()
            };

            RegistrosCredito.create(novoRegistro);

            return res.status(201).json({ 
                sucesso: true, 
                registro: novoRegistro 
            });
        }
    },
    {
        endpoint: "/api/creditos/pendentes",
        method: "get",
        run: async (_req: Express.Request, res: Express.Response) => {
            const pendentes = RegistrosCredito.getMany((r: RegistroCredito) => r.status === 'pendente');

            return res.status(200).json({ 
                sucesso: true, 
                registros: pendentes 
            });
        }
    },
    {
        endpoint: "/api/creditos/aprovar/:id",
        method: "post",
        run: async (req: Express.Request, res: Express.Response) => {
            const { id } = req.params;

            const registro = RegistrosCredito.get((r: RegistroCredito) => r.id === id);
            if (!registro) {
                return res.status(404).json({ erro: "Registro não encontrado" });
            }

            if (registro.status !== 'pendente') {
                return res.status(400).json({ erro: "Registro já foi processado" });
            }

            // Atualizar status do registro
            RegistrosCredito.update(
                (r: RegistroCredito) => r.id === id,
                (r: RegistroCredito) => {
                    r.status = 'aprovado';
                    return r;
                }
            );

            // Atualizar créditos do produtor
            const produtor = Produtores.get((p: Produtor) => p.email === registro.produtorId || p.cpfOuCnpj === registro.produtorId);
            if (produtor) {
                Produtores.update(
                    (p: Produtor) => p.email === registro.produtorId || p.cpfOuCnpj === registro.produtorId,
                    (p: Produtor) => {
                        p.creditos = (p.creditos || 0) + registro.quantidade;
                        return p;
                    }
                );
            }

            // Atualizar objeto local para retornar
            registro.status = 'aprovado';

            return res.status(200).json({ 
                sucesso: true, 
                registro: registro 
            });
        }
    },
    {
        endpoint: "/api/creditos/rejeitar/:id",
        method: "post",
        run: async (req: Express.Request, res: Express.Response) => {
            const { id } = req.params;

            const registro = RegistrosCredito.get((r: RegistroCredito) => r.id === id);
            if (!registro) {
                return res.status(404).json({ erro: "Registro não encontrado" });
            }

            if (registro.status !== 'pendente') {
                return res.status(400).json({ erro: "Registro já foi processado" });
            }

            // Atualizar status do registro
            RegistrosCredito.update(
                (r: RegistroCredito) => r.id === id,
                (r: RegistroCredito) => {
                    r.status = 'rejeitado';
                    return r;
                }
            );

            // Atualizar objeto local para retornar
            registro.status = 'rejeitado';

            return res.status(200).json({ 
                sucesso: true, 
                registro: registro 
            });
        }
    },
    {
        endpoint: "/api/creditos/:produtorId",
        method: "get",
        run: async (req: Express.Request, res: Express.Response) => {
            const { produtorId } = req.params;

            const registros = RegistrosCredito.getMany((r: RegistroCredito) => r.produtorId === produtorId);

            return res.status(200).json({ 
                sucesso: true, 
                registros: registros 
            });
        }
    }
];

export default creditosRoutes;

