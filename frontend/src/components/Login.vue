<template>
 
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-green-700">
        Seja bem vindo! faça seu login
      </h2>
      <InputField
        id="email"
        type="email"
        v-model="email"
        placeholder="Digite seu e-mail"
      />
      <InputField
        id="senha"
        type="password"
        v-model="senha"
        placeholder="Digite sua senha"
      />

      <ButtonGreen class="mt-3" @click="login">Entrar</ButtonGreen>

      <p class="text-center mt-4 text-sm">
        Ainda não tem conta?
        <router-link
          to="/register"
          class="text-green-600 font-semibold hover:underline"
          >Cadastre-se</router-link
        >
      </p>
    </div>
  
</template>



<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const senha = ref('');
const mensagem = ref('');

const login = async () => { 
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      senha: senha.value
    });

    mensagem.value = response.data.message;
    console.log('Tipo de usuário:', response.data.tipo);
    console.log('Dados do usuário:', response.data.user);

    switch (response.data.tipo) {
      case 'administrador':
        router.push('/admin');
        break;
      case 'empresa':
        router.push('/empresa-dashboard');
        break;
      case 'produtor':
        router.push('/produtor-dashboard');
        break;
      default:
        router.push('/');
    }
  } catch (error: any) {
    mensagem.value = error.response?.data?.error || 'Erro no login.';
  }
};
</script>


<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--branco-amarelo);
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: var(--verde-musgo);
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid var(--verde-musgo);
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--verde-musgo);
  border: none;
  border-radius: 4px;
  color: var(--branco-amarelo);
  font-size: 16px;
}
</style>
