import type Express from 'express';
import { Produtores, Empresas, Administradores } from '../database/dbIndex';
import type { Administrador, Empresa, Produtor } from '../types/routesTypes';
import { hashPassword, validatePassword } from '../utils/passwordParser'

const registroRoutes = [
    {
        endpoint: "/api/cadastrar/empresa",
        method: "post",

        run: async(req: Express.Request, res: Express.Response) => {
            const { nomeEmpresa, cnpj, nomeRepresentante, emailEmpresa, senha } = req.body;
            
            // Validação de senha
            const validacaoSenha = validatePassword(senha);
            if (!validacaoSenha.isValid) {
                return res.status(400).json({
                    erro: "Senha não atende aos requisitos de segurança",
                    detalhes: validacaoSenha.errors
                });
            }

            const empresaExiste = Empresas.get((empresa: Empresa) => empresa.cnpj === cnpj) !== null;

            const senhaHash = await hashPassword(senha);
            if (empresaExiste) {
                return res.status(409).send("Essa empresa já existe.");
            } else {
                Empresas.create({
                    "nomeEmpresa": nomeEmpresa,
                    "cnpj": cnpj,
                    "nomeRepresentante": nomeRepresentante,
                    "emailEmpresa": emailEmpresa,
                    "senhaHash" : senhaHash,
                    "creditos" : 0,
                    "transacoes": []

                })
                return res.status(200).send("Conta empresarial criada!");
            }
        }
    },
    {
        endpoint: "/api/cadastrar/produtor",
        method: "post",

        run: async (req: Express.Request, res: Express.Response) => {
            const { nomeCompleto, cpfOuCnpj, endereco, atividade, email, senha } = req.body;
            
            if (!nomeCompleto || !cpfOuCnpj || !email || !senha) {
                return res.status(400).send("Campos obrigatórios não preenchidos.");
            }

            // Validação de senha
            const validacaoSenha = validatePassword(senha);
            if (!validacaoSenha.isValid) {
                return res.status(400).json({
                    erro: "Senha não atende aos requisitos de segurança",
                    detalhes: validacaoSenha.errors
                });
            }

            const emailExiste = Produtores.get((produtor: Produtor) => produtor.email === email) !== null;
            const cpfExiste = Produtores.get((produtor: Produtor) => produtor.cpfOuCnpj === cpfOuCnpj) !== null;

            const senhaHash = await hashPassword(senha);

            if (emailExiste || cpfExiste) {
                return res.status(409).send(`Já existe um usuário produtor cadastrado com esse ${emailExiste ? "email" : "CPF"}.`);
            } else {
                Produtores.create({
                    "nomeCompleto": nomeCompleto,
                    "cpfOuCnpj": cpfOuCnpj,
                    "endereco": endereco,
                    "atividade": atividade,
                    "email": email,
                    "senhaHash": senhaHash,
                    "creditos": 0,
                    "empresas": [],
                    "projetos": []
                });
                return res.status(201).send("Conta de produtor criada com sucesso!");
            }
        }
    },
    {
        endpoint: "/api/cadastrar/admin",
        method: "post",

        run: async (req: Express.Request, res: Express.Response) => {
            const { nome, email, senha, codigoVerificacao } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).send("Campos obrigatórios não preenchidos.");
            }

            // Validação de senha
            const validacaoSenha = validatePassword(senha);
            if (!validacaoSenha.isValid) {
                return res.status(400).json({
                    erro: "Senha não atende aos requisitos de segurança",
                    detalhes: validacaoSenha.errors
                });
            }
            
            const senhaHash = await hashPassword(senha);

            const adminExiste = Administradores.get((admin: Administrador) => admin.email === email) !== null;
            if(adminExiste) {
                return res.status(409).send("Já existe um administrador com esse email.");
            } else if (codigoVerificacao !== "123") {
                return res.status(401).send("Código de verificação incorreto.")
            } else {
                Administradores.create({
                    "nome": nome,
                    "email": email,
                    "senhaHash": senhaHash,
                    "codigoVerificacao": codigoVerificacao
                });
                return res.status(201).send("Administrador criado com sucesso.")
            }
        }
    }
]

export default registroRoutes;