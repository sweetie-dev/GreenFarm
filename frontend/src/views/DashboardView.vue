<template>
  <div class="min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">🌱 GreenFarm - Dashboard Produtor</span>
        <button class="btn btn-outline-light btn-sm" @click="logout">Sair</button>
      </div>
    </nav>

    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">Olá, {{ nomeUsuario }}! 👋</h2>
          <p class="text-muted">Visão geral do seu ecossistema GreenFarm</p>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="erro" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ erro }}
        <button type="button" class="btn-close" @click="erro = ''" aria-label="Close"></button>
      </div>

      <div v-if="sucesso" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ sucesso }}
        <button type="button" class="btn-close" @click="sucesso = ''" aria-label="Close"></button>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-success fw-semibold mb-1">Saldo de Créditos</p>
                  <h3 class="mb-0">{{ saldo }} <small class="text-muted fs-6">ZEA</small></h3>
                </div>
                <div class="fs-1">💰</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-success fw-semibold mb-1">Projetos Ativos</p>
                  <h3 class="mb-0">{{ projetos.length }}</h3>
                </div>
                <div class="fs-1">📊</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-success fw-semibold mb-1">Transações</p>
                  <h3 class="mb-0">{{ transacoes.length }}</h3>
                </div>
                <div class="fs-1">💳</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- Projetos -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pt-3">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 class="mb-0">Meus Projetos</h5>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-success" @click="modalNovoProjeto = true">
                    + Novo Projeto
                  </button>
                  <button class="btn btn-outline-success" @click="modalRegistrarCredito = true">
                    Registrar Créditos
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div v-if="carregandoProjetos" class="text-center py-4">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Carregando...</span>
                </div>
              </div>

              <div v-else-if="projetos.length === 0" class="text-center py-5 text-muted">
                <p class="mb-0">Nenhum projeto cadastrado ainda.</p>
                <button class="btn btn-success btn-sm mt-3" @click="modalNovoProjeto = true">
                  Criar Primeiro Projeto
                </button>
              </div>

              <div v-else class="list-group list-group-flush">
                <div v-for="projeto in projetos" :key="projeto.id" class="list-group-item px-0">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 class="mb-1">{{ projeto.nome }}</h6>
                      <p class="text-muted small mb-0">{{ projeto.descricao || 'Sem descrição' }}</p>
                    </div>
                    <span class="badge bg-success">{{ projeto.progresso }}%</span>
                  </div>
                  <div class="progress" style="height: 8px;">
                    <div 
                      class="progress-bar bg-success" 
                      :style="{ width: projeto.progresso + '%' }"
                    ></div>
                  </div>
                  <div class="mt-2 small text-muted">
                    Créditos esperados: {{ projeto.creditosEsperados || 0 }} ZEA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transações Recentes -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="mb-0">Transações Recentes</h5>
            </div>
            <div class="card-body">
              <div v-if="carregandoTransacoes" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-success" role="status"></div>
              </div>

              <div v-else-if="transacoes.length === 0" class="text-center py-4 text-muted">
                <p class="small mb-0">Nenhuma transação ainda</p>
              </div>

              <div v-else class="list-group list-group-flush">
                <div v-for="(trans, idx) in transacoes" :key="idx" class="list-group-item px-0 border-0 border-bottom">
                  <div class="d-flex align-items-start">
                    <span class="badge bg-success-subtle text-success me-2">{{ trans.tipo }}</span>
                    <div class="flex-grow-1">
                      <p class="mb-1 small fw-semibold">{{ trans.quantidade }} créditos</p>
                      <p class="mb-0 text-muted" style="font-size: 0.75rem;">
                        {{ formatarData(trans.data) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Novo Projeto -->
    <div v-if="modalNovoProjeto" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Novo Projeto</h5>
            <button type="button" class="btn-close" @click="modalNovoProjeto = false"></button>
          </div>
          <form @submit.prevent="criarProjeto">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nome do Projeto</label>
                <input type="text" class="form-control" v-model="novoProjeto.nome" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Descrição</label>
                <textarea class="form-control" v-model="novoProjeto.descricao" rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="modalNovoProjeto = false">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="carregando">
                <span v-if="carregando" class="spinner-border spinner-border-sm me-2"></span>
                Criar Projeto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Registrar Crédito -->
    <div v-if="modalRegistrarCredito" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registrar Créditos</h5>
            <button type="button" class="btn-close" @click="modalRegistrarCredito = false"></button>
          </div>
          <form @submit.prevent="registrarCreditos">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Projeto (opcional)</label>
                <select class="form-select" v-model="novoCredito.projetoId">
                  <option value="">Nenhum projeto específico</option>
                  <option v-for="p in projetos" :key="p.id" :value="p.id">{{ p.nome }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Quantidade de Créditos</label>
                <input type="number" class="form-control" v-model="novoCredito.quantidade" min="1" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Data</label>
                <input type="date" class="form-control" v-model="novoCredito.data" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Observação</label>
                <textarea class="form-control" v-model="novoCredito.observacao" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="modalRegistrarCredito = false">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="carregando">
                <span v-if="carregando" class="spinner-border spinner-border-sm me-2"></span>
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { projetos as projetosApi, creditos, dashboard, transacoes as transacoesApi } from '../services/api';

const router = useRouter();
const nomeUsuario = ref('');
const usuarioId = ref('');
const saldo = ref(0);
const projetos = ref([]);
const transacoes = ref([]);
const erro = ref('');
const sucesso = ref('');
const carregando = ref(false);
const carregandoProjetos = ref(false);
const carregandoTransacoes = ref(false);

const modalNovoProjeto = ref(false);
const modalRegistrarCredito = ref(false);
const novoProjeto = ref({ nome: '', descricao: '' });
const novoCredito = ref({ projetoId: '', quantidade: '', data: new Date().toISOString().split('T')[0], observacao: '' });

onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const tipo = localStorage.getItem('tipoUsuario');
  
  if (!usuario || tipo !== 'produtor') {
    router.push('/login');
    return;
  }

  nomeUsuario.value = usuario.nomeCompleto || 'Produtor';
  usuarioId.value = usuario.email || usuario.cpfOuCnpj;
  
  await carregarDados();
});

async function carregarDados() {
  await Promise.all([
    carregarSaldo(),
    carregarProjetos(),
    carregarTransacoes()
  ]);
}

async function carregarSaldo() {
  try {
    const response = await dashboard.obterSaldo(usuarioId.value);
    saldo.value = response.data.saldo || 0;
  } catch (error) {
    console.error('Erro ao carregar saldo:', error);
  }
}

async function carregarProjetos() {
  carregandoProjetos.value = true;
  try {
    const response = await projetosApi.listarPorProdutor(usuarioId.value);
    projetos.value = response.data.projetos || [];
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
  } finally {
    carregandoProjetos.value = false;
  }
}

async function carregarTransacoes() {
  carregandoTransacoes.value = true;
  try {
    const response = await transacoesApi.listar(usuarioId.value);
    transacoes.value = response.data.transacoes || [];
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
  } finally {
    carregandoTransacoes.value = false;
  }
}

async function criarProjeto() {
  if (!novoProjeto.value.nome) {
    erro.value = 'Nome do projeto é obrigatório';
    return;
  }

  carregando.value = true;
  erro.value = '';
  
  try {
    await projetosApi.criar({
      produtorId: usuarioId.value,
      nome: novoProjeto.value.nome,
      descricao: novoProjeto.value.descricao
    });

    sucesso.value = 'Projeto criado com sucesso!';
    modalNovoProjeto.value = false;
    novoProjeto.value = { nome: '', descricao: '' };
    await carregarProjetos();
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    erro.value = error.response?.data?.erro || 'Erro ao criar projeto';
  } finally {
    carregando.value = false;
  }
}

async function registrarCreditos() {
  if (!novoCredito.value.quantidade || novoCredito.value.quantidade <= 0) {
    erro.value = 'Quantidade inválida';
    return;
  }

  carregando.value = true;
  erro.value = '';
  
  try {
    await creditos.registrar({
      produtorId: usuarioId.value,
      projetoId: novoCredito.value.projetoId || undefined,
      quantidade: Number(novoCredito.value.quantidade),
      data: novoCredito.value.data,
      observacao: novoCredito.value.observacao
    });

    sucesso.value = 'Créditos registrados com sucesso! Aguardando aprovação do administrador.';
    modalRegistrarCredito.value = false;
    novoCredito.value = { projetoId: '', quantidade: '', data: new Date().toISOString().split('T')[0], observacao: '' };
  } catch (error) {
    console.error('Erro ao registrar créditos:', error);
    erro.value = error.response?.data?.erro || 'Erro ao registrar créditos';
  } finally {
    carregando.value = false;
  }
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function logout() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('tipoUsuario');
  router.push('/login');
}
</script>

<style scoped>
.modal.show {
  display: block;
}
</style>
