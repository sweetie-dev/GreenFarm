import type Express from 'express';
import { Produtores, Empresas, Administradores } from '../database/dbIndex'
import type { Administrador, Empresa, Produtor } from '../types/routesTypes'

const registroRoutes = [
    {
        endpoint: "/registrar/empresa",
        method: "post",

        run: async(req: Express.Request, res: Express.Response) => {
            const { nomeEmpresa, cnpj, nomeRepresentante, emailEmpresa, senha } = req.body;
            const empresaExiste = Empresas.get((empresa: Empresa) => empresa.cnpj === cnpj) !== null;

            const senhaHash = senha;
            if (empresaExiste) {
                return res.status(409).send("Essa empresa já existe.");
            } else {
                Empresas.create({
                    "nomeEmpresa": nomeEmpresa,
                    "cnpj": cnpj,
                    "nomeRepresentante": nomeRepresentante,
                    "emailEmpresa": emailEmpresa,
                    "senhaHash" : senhaHash
                })
                return res.status(200).send("Conta empresarial criada!");
            }
        }
    },
    {
        endpoint: "/registrar/produtor",
        method: "post",

        run: async (req: Express.Request, res: Express.Response) => {
            const { nomeCompleto, cpfOuCnpj, endereco, atividade, email, senha } = req.body;
            
            if (!nomeCompleto || !cpfOuCnpj || !email || !senha) {
                return res.status(400).send("Campos obrigatórios não preenchidos.");
            }

            const emailExiste = Produtores.get((produtor: Produtor) => produtor.email === email) !== null;
            const cpfExiste = Produtores.get((produtor: Produtor) => produtor.cpfOuCnpj === cpfOuCnpj) !== null;

            const senhaHash = senha;

            if (emailExiste || cpfExiste) {
                return res.status(409).send(`Já existe um usuário produtor cadastrado com esse ${emailExiste ? "email" : "CPF"}.`);
            } else {
                Produtores.create({
                    "nomeCompleto": nomeCompleto,
                    "cpfOuCnpj": cpfOuCnpj,
                    "endereco": endereco,
                    "atividade": atividade,
                    "email": email,
                    "senhaHash": senhaHash
                });
                return res.status(201).send("Conta de produtor criada com sucesso!");
            }
        }
    },
    {
        endpoint: "/registrar/admin",
        method: "post",

        run: async (req: Express.Request, res: Express.Response) => {
            const { nome, email, senha, codigoVerificacao } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).send("Campos obrigatórios não preenchidos.");
            }
            
            const senhaHash = senha; // falta colocar o bcrypt

            const adminExiste = Administradores.get((admin: Administrador) => admin.email === email) !== null;
            if(adminExiste) {
                return res.status(409).send("Já existe um administrador com esse email.");
            } else if (codigoVerificacao !== "123") {
                return res.status(403).send("Código de verificação incorreto.")
            } else {
                Administradores.create({
                    "nome": nome,
                    "email": email,
                    "senha": senhaHash
                });
                return res.status(201).send("Administrador criado com sucesso.")
            }
        }
    }
]

export default registroRoutes;