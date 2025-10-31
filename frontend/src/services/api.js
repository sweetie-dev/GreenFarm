import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token se existir
api.interceptors.request.use(
  config => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.token) {
      config.headers.Authorization = `Bearer ${usuario.token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Erro da API
      console.error('Erro da API:', error.response.data);
    } else if (error.request) {
      // Sem resposta do servidor
      console.error('Servidor não respondeu:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const auth = {
  login: (email, senhaText) => api.post('/login', { email, senhaText }),
  
  cadastrarProdutor: (dados) => api.post('/cadastrar/produtor', {
    nomeCompleto: dados.nome,
    cpfOuCnpj: dados.cpf,
    endereco: dados.localizacao,
    atividade: dados.atividade,
    email: dados.email,
    senha: dados.senha
  }),
  
  cadastrarEmpresa: (dados) => api.post('/cadastrar/empresa', {
    nomeEmpresa: dados.nomeEmpresa,
    cnpj: dados.cnpj,
    nomeRepresentante: dados.nomeRepresentante,
    emailEmpresa: dados.email,
    senha: dados.senha
  }),
  
  cadastrarAdmin: (dados) => api.post('/cadastrar/admin', {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    codigoVerificacao: dados.codigoVerificacao
  })
};

// Serviços de Créditos
export const creditos = {
  registrar: (dados) => api.post('/creditos/registrar', dados),
  listarPendentes: () => api.get('/creditos/pendentes'),
  aprovar: (id) => api.post(`/creditos/aprovar/${id}`),
  rejeitar: (id) => api.post(`/creditos/rejeitar/${id}`),
  listarPorProdutor: (produtorId) => api.get(`/creditos/${produtorId}`)
};

// Serviços de Projetos
export const projetos = {
  criar: (dados) => api.post('/projetos', dados),
  listarPorProdutor: (produtorId) => api.get(`/projetos/${produtorId}`),
  atualizar: (id, dados) => api.put(`/projetos/${id}`, dados)
};

// Serviços de Produtores
export const produtores = {
  listar: () => api.get('/produtores'),
  obter: (id) => api.get(`/produtores/${id}`)
};

// Serviços de Transações
export const transacoes = {
  comprar: (dados) => api.post('/transacoes/comprar', dados),
  listar: (usuarioId) => api.get(`/transacoes/${usuarioId}`)
};

// Serviços de Dashboard
export const dashboard = {
  obterSaldo: (id) => api.get(`/dashboard/saldo/${id}`),
  obterTransacoes: (id, limit = 5) => api.get(`/dashboard/transacoes/${id}`, { params: { limit } }),
  obterUsuario: (id) => api.get(`/dashboard/usuario/${id}`)
};

export default api;
