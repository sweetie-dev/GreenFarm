import type Express from 'express';
import { Transacoes, Empresas, Produtores } from '../database/dbIndex';
import type { Transacao, Empresa, Produtor } from '../types/routesTypes';

const transacoesRoutes = [
    {
        endpoint: "/api/transacoes/comprar",
        method: "post",
        run: async (req: Express.Request, res: Express.Response) => {
            const { empresaId, produtorId, quantidade, valor } = req.body;

            if (!empresaId || !produtorId || !quantidade || quantidade <= 0 || !valor) {
                return res.status(400).json({ 
                    erro: "Empresa ID, Produtor ID, quantidade e valor são obrigatórios" 
                });
            }

            const empresa = Empresas.get((e: Empresa) => e.cnpj === empresaId || e.emailEmpresa === empresaId);
            const produtor = Produtores.get((p: Produtor) => p.cpfOuCnpj === produtorId || p.email === produtorId);

            if (!empresa) return res.status(404).json({ erro: "Empresa não encontrada" });
            if (!produtor) return res.status(404).json({ erro: "Produtor não encontrado" });

            if ((produtor.creditos || 0) < quantidade) {
                return res.status(400).json({ erro: "Produtor não possui créditos suficientes" });
            }

            const novaTransacao: Transacao = {
                id: Date.now().toString(),
                empresaId: empresaId,
                produtorId: produtorId,
                quantidade: Number(quantidade),
                valor: Number(valor),
                data: new Date().toISOString(),
                tipo: 'compra'
            };

            Transacoes.create(novaTransacao);

            // Atualizar produtor: saldos e relacionamentos
            Produtores.update(
                (p: Produtor) => p.cpfOuCnpj === produtorId || p.email === produtorId,
                (p: Produtor) => {
                    p.creditos = (p.creditos || 0) - quantidade;
                    if (!p.empresas) p.empresas = [];
                    if (!p.empresas.includes(empresaId)) {
                        p.empresas.push(empresaId);
                    }
                    return p;
                }
            );

            // Atualizar empresa: saldos e relacionamentos
            Empresas.update(
                (e: Empresa) => e.cnpj === empresaId || e.emailEmpresa === empresaId,
                (e: Empresa) => {
                    e.creditos = (e.creditos || 0) + quantidade;
                    if (!e.transacoes) e.transacoes = [];
                    e.transacoes.push(novaTransacao.id);
                    return e;
                }
            );

            return res.status(201).json({ 
                sucesso: true, 
                transacao: novaTransacao 
            });
        }
    },
    {
        endpoint: "/api/transacoes/:usuarioId",
        method: "get",
        run: async (req: Express.Request, res: Express.Response) => {
            const { usuarioId } = req.params;

            const transacoes = Transacoes.getMany((t: Transacao) => 
                t.empresaId === usuarioId || t.produtorId === usuarioId
            );

            return res.status(200).json({ 
                sucesso: true, 
                transacoes: transacoes 
            });
        }
    }
];

export default transacoesRoutes;
