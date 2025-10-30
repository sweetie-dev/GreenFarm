<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    handleSubmit() {
      // Aqui você pode integrar com o backend para login
      console.log('Email:', this.email);
      console.log('Senha:', this.password);
    }
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
