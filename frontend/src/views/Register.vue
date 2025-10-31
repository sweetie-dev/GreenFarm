<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-7">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-success mb-2">🌱 Cadastro GreenFarm</h2>
                <p class="text-muted">Escolha o tipo de conta</p>
              </div>

              <!-- Seleção de tipo -->
              <div class="btn-group w-100 mb-4" role="group">
                <button
                  v-for="t in tipos"
                  :key="t"
                  @click="tipo = t"
                  type="button"
                  :class="['btn', tipo === t ? 'btn-success' : 'btn-outline-success']"
                >
                  <span class="me-2">
                    {{ t === 'Produtor' ? '🌱' : t === 'Empresa' ? '🏢' : '⚙️' }}
                  </span>
                  {{ t }}
                </button>
              </div>

              <div v-if="erro" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ erro }}
                <button type="button" class="btn-close" @click="erro = ''" aria-label="Close"></button>
              </div>

              <div v-if="sucesso" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ sucesso }}
                <button type="button" class="btn-close" @click="sucesso = ''" aria-label="Close"></button>
              </div>

              <form @submit.prevent="register">
                <!-- Formulário Produtor -->
                <template v-if="tipo === 'Produtor'">
                  <div class="mb-3">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" v-model="dados.nome" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">CPF/CNPJ</label>
                    <input type="text" class="form-control" v-model="dados.cpf" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Localização</label>
                    <input type="text" class="form-control" v-model="dados.localizacao" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Atividade</label>
                    <input type="text" class="form-control" v-model="dados.atividade" 
                           placeholder="Ex: agricultura, reflorestamento..." required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-control" v-model="dados.email" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input type="password" class="form-control" v-model="dados.senha" required />
                    <small class="form-text text-muted">Mínimo 8 caracteres, letra maiúscula e número</small>
                  </div>
                </template>

                <!-- Formulário Empresa -->
                <template v-else-if="tipo === 'Empresa'">
                  <div class="mb-3">
                    <label class="form-label">Nome da Empresa</label>
                    <input type="text" class="form-control" v-model="dados.nomeEmpresa" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">CNPJ</label>
                    <input type="text" class="form-control" v-model="dados.cnpj" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Representante Responsável</label>
                    <input type="text" class="form-control" v-model="dados.nomeRepresentante" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">E-mail Corporativo</label>
                    <input type="email" class="form-control" v-model="dados.email" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input type="password" class="form-control" v-model="dados.senha" required />
                    <small class="form-text text-muted">Mínimo 8 caracteres, letra maiúscula e número</small>
                  </div>
                </template>

                <!-- Formulário Administrador -->
                <template v-else>
                  <div class="mb-3">
                    <label class="form-label">Nome do Administrador</label>
                    <input type="text" class="form-control" v-model="dados.nome" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-control" v-model="dados.email" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input type="password" class="form-control" v-model="dados.senha" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Código de Verificação</label>
                    <input type="text" class="form-control" v-model="dados.codigoVerificacao" required />
                  </div>
                </template>

                <button 
                  type="submit" 
                  class="btn btn-success btn-lg w-100 mb-3"
                  :disabled="carregando"
                >
                  <span v-if="carregando" class="spinner-border spinner-border-sm me-2"></span>
                  {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
                </button>
              </form>

              <p class="text-center mb-0">
                Já tem conta?
                <router-link to="/login" class="text-success fw-semibold text-decoration-none">
                  Entrar
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../services/api';

const router = useRouter();
const tipo = ref('Produtor');
const tipos = ['Produtor', 'Empresa', 'Administrador'];
const dados = ref({});
const erro = ref('');
const sucesso = ref('');
const carregando = ref(false);

async function register() {
  erro.value = '';
  sucesso.value = '';
  carregando.value = true;

  try {
    let response;
    
    if (tipo.value === 'Produtor') {
      response = await auth.cadastrarProdutor(dados.value);
    } else if (tipo.value === 'Empresa') {
      response = await auth.cadastrarEmpresa(dados.value);
    } else {
      response = await auth.cadastrarAdmin(dados.value);
    }

    sucesso.value = `Cadastro de ${tipo.value} realizado com sucesso! Redirecionando...`;
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    console.error('Erro no cadastro:', error);
    if (error.response) {
      erro.value = error.response.data.erro || error.response.data.detalhes?.join(', ') || 'Erro ao realizar cadastro.';
    } else {
      erro.value = 'Erro de conexão com o servidor. Tente novamente.';
    }
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.btn-group .btn {
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
}
</style>
