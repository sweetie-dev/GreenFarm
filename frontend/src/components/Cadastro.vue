<template>
  <div class="cadastro-page">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
      <div class="flex justify-center gap-4 mb-6">
        <div v-for="t in tipos" :key="t">
          <br />
          <button
            @click="tipo = t"
            :class="[
              'px-6 py-3 rounded-xl font-semibold shadow-sm transition duration-300 ease-in-out transform hover:scale-105',
              tipo === t
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-green-100 text-green-700 hover:bg-green-200',
            ]"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <br />
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
.cadastro-page h2 {
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
}

.cadastro-page button {
  transition: transform 0.2s ease;
}

.cadastro-page button:hover {
  transform: scale(1.03);
}
</style>


<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';

const tipo = ref('');

const dados = reactive({
  nome: '',
  cpf: '',
  localizacao: '',
  atividade: '',
  email: '',
  senha: '',
  cnpj: '',
  representante: '',
  codigo: ''
});

const mensagem = ref('');

const register = async () => {
  try {
    const payload: any = { tipo: tipo.value, email: dados.email, senha: dados.senha };

    if (tipo.value === 'Produtor') {
      Object.assign(payload, {
        nomeCompleto: dados.nome,
        cpfCnpj: dados.cpf,
        localizacao: dados.localizacao,
        tipoAtividade: dados.atividade
      });
    } else if (tipo.value === 'Empresa') {
      Object.assign(payload, {
        nomeEmpresa: dados.nome,
        cnpj: dados.cnpj,
        representante: dados.representante
      });
    } else { 
      
      Object.assign(payload, {
        nome: dados.nome,
        codigoVerificacao: dados.codigo
      });
    }


    const response = await axios.post('http://localhost:3000/usuarios', payload);
    mensagem.value = response.data.message;
    tipo.value = '';
    for (const key in dados) {
      dados[key as keyof typeof dados] = '';
    }
  } catch (error: any) {
    mensagem.value = error.response?.data?.error || 'Erro ao cadastrar.';
  }
};
</script>
