<template>
  <div class="login-wrapper">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-6 col-lg-4">
          <div class="card shadow border-0 rounded-3">
            <div class="card-body p-4">
              <div class="text-center mb-3">
                <h4 class="fw-bold text-success mb-1">🌱 GreenFarm</h4>
                <p class="text-muted small mb-0">Faça seu login</p>
              </div>

              <div v-if="erro" class="alert alert-danger alert-dismissible fade show py-2 small" role="alert">
                {{ erro }}
                <button type="button" class="btn-close btn-close-sm" @click="erro = ''" aria-label="Close"></button>
              </div>

              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label small mb-1">E-mail</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="senha" class="form-label small mb-1">Senha</label>
                  <input
                    type="password"
                    class="form-control"
                    id="senha"
                    v-model="senha"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  class="btn btn-success w-100 mb-3"
                  :disabled="carregando"
                >
                  <span v-if="carregando" class="spinner-border spinner-border-sm me-2"></span>
                  {{ carregando ? 'Entrando...' : 'Entrar' }}
                </button>
              </form>

              <p class="text-center mb-0 small">
                Ainda não tem conta?
                <router-link to="/register" class="text-success fw-semibold text-decoration-none">
                  Cadastre-se
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
const email = ref('');
const senha = ref('');
const erro = ref('');
const carregando = ref(false);

async function login() {
  if (!email.value || !senha.value) {
    erro.value = 'Por favor, preencha todos os campos.';
    return;
  }

  carregando.value = true;
  erro.value = '';

  try {
    const response = await auth.login(email.value, senha.value);
    
    if (response.data.sucesso) {
      // Salvar dados do usuário no localStorage
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      localStorage.setItem('tipoUsuario', response.data.tipo);
      
      // Redirecionar baseado no tipo de usuário
      if (response.data.tipo === 'produtor') {
        router.push('/dashboard');
      } else if (response.data.tipo === 'empresa') {
        router.push('/company');
      } else if (response.data.tipo === 'admin') {
        router.push('/admin');
      }
    }
  } catch (error) {
    console.error('Erro no login:', error);
    if (error.response) {
      erro.value = error.response.data.erro || 'Erro ao fazer login. Verifique suas credenciais.';
    } else {
      erro.value = 'Erro de conexão com o servidor. Tente novamente.';
    }
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.btn-close-sm {
  font-size: 0.75rem;
}

@media (max-height: 700px) {
  .login-wrapper {
    align-items: flex-start;
  }
}
</style>
