<script setup>
</script>

<template>
	<nav class="main-nav">
		<router-link to="/login">Login</router-link>
		<router-link to="/cadastro">Cadastro</router-link>
	</nav>

	<router-view />
</template>

<style scoped>
.main-nav {
	display: flex;
	gap: 1rem;
	padding: 1rem;
}
</style>
