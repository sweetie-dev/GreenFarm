<template>
  <div class="mb-3">
    <label :for="id" class="block font-semibold mb-1">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      v-model="model"
      :placeholder="placeholder"
      class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
});
const model = defineModel();
</script>
