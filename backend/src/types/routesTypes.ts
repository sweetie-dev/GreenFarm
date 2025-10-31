export interface Empresa {
    nomeEmpresa: string;
    cnpj: string;
    nomeRepresentante: string;
    emailEmpresa: string;
    senhaHash: string;
    creditos: number;
    transacoes: string[];
}

export interface Produtor {
    nomeCompleto: string;
    cpfOuCnpj: string;
    endereco: string;
    atividade: string;
    email: string;
    senhaHash: string;
    creditos: number;
    empresas: string[];
    projetos: string[];
}

export interface Administrador {
    nome: string;
    email: string;
    senhaHash: string;
    codigoVerificacao: string;
}

export interface Projeto {
    id: string;
    produtorId: string;
    nome: string;
    descricao: string;
    progresso: number;
    creditosEsperados: number;
    finalizado: boolean;
    criadoEm: string;
}

export interface Transacao {
    id: string;
    empresaId: string;
    produtorId: string;
    quantidade: number;
    valor: number;
    data: string;
    tipo: 'compra' | 'venda';
}

export interface RegistroCredito {
    id: string;
    produtorId: string;
    projetoId?: string;
    quantidade: number;
    data: string;
    observacao?: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    criadoEm: string;
}