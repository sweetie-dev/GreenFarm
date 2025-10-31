import type Express from "express";
import { Produtores, Administradores, Empresas } from '../database/dbIndex';
import type { Produtor, Administrador, Empresa } from '../types/routesTypes';
import { comparePassword } from '../utils/passwordParser'

const loginRoutes = [
    {
        endpoint: "/api/login",
        method: "get",

        run: async (req: Express.Request, res: Express.Response) => {

            const { email, senhaText } = req.body;

            // Validação de campos obrigatórios
            if (!email || !senhaText) {
                return res.status(400).send("Email e senha são obrigatórios");
            }
 
            const produtorExistente = Produtores.get((produtor: Produtor) => produtor.email === email);
            const adminExistente = Administradores.get((admin: Administrador) => admin.email === email);
            const empresaExistente = Empresas.get((empresa: Empresa) => empresa.emailEmpresa === email);

            
            if (!produtorExistente && !adminExistente && !empresaExistente) {
                return res.status(404).send("Usuário não existe");
            }
            
            let senhaHash: string = '';
            let userType: string = '';
            let userData: any = null;

            if (produtorExistente) {
                senhaHash = produtorExistente.senhaHash;
                userType = "produtor";
                userData = produtorExistente;
            } else if (adminExistente) {
                senhaHash = adminExistente.senhaHash;
                userType = "admin";
                userData = adminExistente;
            } else if (empresaExistente) {
                senhaHash = empresaExistente.senhaHash;
                userType = "empresa";
                userData = empresaExistente;
            }

            // Validação adicional do hash
            if (!senhaHash) {
                return res.status(500).send("Erro ao recuperar senha do usuário");
            }

            try {
                const senhaCorreta = await comparePassword(senhaText, senhaHash);
                
                if (senhaCorreta) {
                    return res.status(200).json({
                        user: userData,
                        type: userType
                    });
                } else {
                    return res.status(401).send("Senha incorreta");
                }
            } catch (error) {
                console.error('Erro ao comparar senha:', error);
                return res.status(500).send("Erro ao processar login");
            }

        }
    }
]

export default loginRoutes;