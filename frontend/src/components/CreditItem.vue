<template>
  <li class="credit-item">
    <div class="credit-info">
      <strong>{{ credit.producer }}</strong>
      <div class="muted">Projeto: {{ credit.project || '—' }} • Data: {{ credit.date || '—' }}</div>
      <div class="muted">Observação: {{ credit.note || 'Nenhuma' }}</div>
    </div>

    <div class="credit-actions">
      <div class="amount">{{ credit.amount }} ZEA</div>
      <div class="row">
        <button class="btn-ghost" @click="$emit('reject', credit)">Rejeitar</button>
        <button class="btn-approve" @click="$emit('approve', credit)">Aprovar</button>
      </div>
    </div>
  </li>
</template>

<script setup>
import ButtonGreen from './ButtonGreen.vue';
defineProps({
  credit: Object,
});
</script>

<style scoped>
.credit-item { display:flex; justify-content:space-between; gap:16px; padding:12px 0; border-bottom:1px dashed #eef2f7; align-items:flex-start; }
.credit-info { max-width:64%; }
.credit-actions { display:flex; flex-direction:column; align-items:flex-end; gap:8px; min-width:180px; }
.amount { font-weight:700; color:#065f46; }
.row { display:flex; gap:8px; width:100%; }
.btn-ghost { padding:8px 10px; border-radius:8px; background:transparent; border:1px solid #d1d5db; cursor:pointer; }
.muted { color:#6b7280; font-size:0.9rem; margin-top:6px; }
</style>
