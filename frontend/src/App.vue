<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="bg-success text-white p-4 text-center fw-bold fs-4">
      <img src="/GreenFarm.png" alt="Logo GreenFarm" class="logo" />
    </header>

    <main class="flex-grow-1">
      <router-view />
    </main>

    <footer class="text-center small p-4 text-muted bg-light">
      © 2025 GreenFarm. Todos os direitos reservados.
    </footer>
  </div>
</template>
