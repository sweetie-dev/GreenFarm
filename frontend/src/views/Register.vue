<template>
  <div class="cadastro-page">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
      <div class="tipos-container">
        <button
          v-for="t in tipos"
          :key="t"
          @click="tipo = t"
          :class="[
            'tipo-btn',
            { active: tipo === t }
          ]"
        >
          <span class="icon">
            {{ t === 'Produtor' ? '🌱' : t === 'Empresa' ? '🏢' : '⚙️' }}
          </span>
          {{ t }}
        </button>
      </div>
      <form @submit.prevent="register">
        <template v-if="tipo === 'Produtor'">
          <InputField
            v-model="dados.nome"
            type="text"
            placeholder="Digite seu nome completo"
          />
          <InputField
            v-model="dados.cpf"
            type="text"
            placeholder="Digite seu CPF/ CNPJ"
          />
          <InputField
            v-model="dados.localizacao"
            type="text"
            placeholder="Digite sua localizção"
          />
          <InputField
            v-model="dados.atividade"
            type="text"
            placeholder="Tipo de atividade (ex: agricultura, reflorestamento...)"
          />
          <InputField
            type="email"
            v-model="dados.email"
            placeholder="Digite seu Email"
          />
          <InputField
            type="password"
            v-model="dados.senha"
            placeholder="Digite sua senha"
          />
        </template>

        <template v-else-if="tipo === 'Empresa'">
          <InputField
            placeholder="Digite o nome da empresa"
            v-model="dados.nome"
          />
          <InputField placeholder="Digite o CNPJ" v-model="dados.cnpj" />
          <InputField
            placeholder="Representante Responsavel"
            v-model="dados.representante"
          />
          <InputField
            placeholder="E-mail corporativo"
            type="email"
            v-model="dados.email"
          />
          <InputField
            placeholder="Senha"
            type="password"
            v-model="dados.senha"
          />
        </template>

        <template v-else>
          <InputField
            placeholder="Nome do administrador"
            v-model="dados.nome"
          />
          <InputField placeholder="E-mail" type="email" v-model="dados.email" />
          <InputField
            placeholder="Digite sua Senha"
            type="password"
            v-model="dados.senha"
          />
          <InputField
            placeholder="Código de verificação"
            v-model="dados.codigo"
          />
        </template>

        <ButtonGreen class="mt-4" type="submit">Cadastrar</ButtonGreen>
      </form>
      <center>
        <p class="text-center mt-4 text-sm">
          Já tem conta?
          <router-link
            to="/login"
            class="text-green-600 font-semibold hover:underline"
            >Entrar</router-link
          >
        </p>
      </center>
    </div>
  </div>
</template>

<style scoped>
.tipos-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.tipo-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  border: 2px solid transparent;
  background: #f0fdf4;
  color: #065f46;
  transition: all 0.2s ease;
}

.tipo-btn:hover {
  background: #dcfce7;
  transform: translateY(-1px);
}

.tipo-btn.active {
  background: #059669;
  color: white;
  border-color: #047857;
}

.icon {
  font-size: 1.2rem;
}
</style>

<script setup>
import InputField from '../components/InputField.vue';
import ButtonGreen from '../components/ButtonGreen.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tipo = ref('Produtor');
const tipos = ['Produtor', 'Empresa', 'Administrador'];
const dados = ref({});

function register() {
  alert(`Cadastro de ${tipo.value} realizado com sucesso!`);
  router.push('/login');
}
</script>
