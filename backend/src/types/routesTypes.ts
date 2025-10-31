export interface Empresa {
    nomeEmpresa: string;
    cnpj: string;
    nomeRepresentante: string;
    emailEmpresa: string;
    senha: number;
}

export interface Produtor {
    nomeCompleto: string;
    cpfOuCnpj: string;
    endereco: string;
    atividade: string;
    email: string;
    senha: string;
}

export interface Administrador {
    nome: string;
    email: string;
    senha: string;
    codigoVerificacao: string;
}