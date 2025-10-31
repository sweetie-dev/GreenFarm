<template>
  <div
    id="app"
    class="min-h-screen bg-green-50 text-gray-800 flex flex-col justify-between"
  >
    <header
      class="bg-green-700 text-white p-4 text-center font-bold text-xl shadow"
    >
      <img src="/GreenFarm.png" alt="Logo GreenFarm" class="logo" />
    </header>

    <main class="flex-grow flex justify-center items-center p-6">
      <router-view />
    </main>
    <center>
      <footer class="text-center text-sm p-4 text-gray-600 bg-green-100">
        © 2025 GreenFarm. Todos os direitos reservados.
      </footer>
    </center>
  </div>
</template>
