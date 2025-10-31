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

<script setup>
import InputField from '../components/InputField.vue';
import ButtonGreen from '../components/ButtonGreen.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const senha = ref('');

function login() {
  if (email.value && senha.value) {
    alert(`Bem-vindo de volta, ${email.value}!`);
    router.push('/company');
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}
</script>
