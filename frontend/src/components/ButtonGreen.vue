<template>
  <button
    class="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
