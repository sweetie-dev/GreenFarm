<template>
  <div class="dashboard-root">
    <header class="dashboard-header">
      <div>
        <h1 class="h1">Painel Admin</h1>
        <p class="sub">Gerencie registros e aprove créditos pendentes</p>
      </div>
      <div class="header-actions">
        <input v-model="search" placeholder="Buscar produtor, projeto..." class="search" />
      </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Créditos Pendentes</div>
        <div class="stat-value">{{ pendingTotal }} ZEA</div>
        <div class="stat-sub">Itens: {{ pending.length }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Créditos Aprovados</div>
        <div class="stat-value">{{ approvedTotal }} ZEA</div>
        <div class="stat-sub">Itens: {{ approved.length }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Atividades</div>
        <div class="stat-value">{{ activities.length }}</div>
        <div class="stat-sub">Última: {{ activities[0]?.time || '—' }}</div>
      </div>
    </section>

    <section class="main-grid">
      <div class="card">
        <div class="card-head">
          <h2>Registros de Créditos</h2>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn-ghost" @click="bulkApprove">Aprovar todos</button>
            <button class="btn-limpar" @click="clearFilters">Limpar</button>
          </div>
        </div>

        <ul class="project-list">
          <CreditItem
            v-for="c in filtered"
            :key="c.id"
            :credit="c"
            @approve="approveCredit"
            @reject="rejectCredit"
          />
          <li v-if="filtered.length===0" class="muted">Nenhum registro encontrado.</li>
        </ul>
      </div>

      <div class="card activity-card">
        <h2>Atividades Recentes</h2>
        <ul class="activity-list">
          <li v-for="(a, i) in activities" :key="i">
            <span class="dot"></span>
            <div>
              <strong>{{ a.title }}</strong>
              <div class="muted">{{ a.time }}</div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CreditItem from '../components/CreditItem.vue';

// dados de exemplo — em app real viria da API
const pending = ref([
  { id: 1, producer: 'João Silva', project: 'Reflorestamento Amazônico', amount: 50, date: '2025-10-12', note: 'Mudas certificadas' },
  { id: 2, producer: 'Maria Oliveira', project: 'Horta Comunitária SP', amount: 20, date: '2025-10-15', note: '' },
  { id: 3, producer: 'Cooperativa Verde', project: '', amount: 150, date: '2025-10-20', note: 'Créditos por sequestro' },
]);

const approved = ref([]);
const activities = ref([ { title: 'Admin iniciado', time: 'agora' } ]);

const search = ref('');

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return pending.value;
  return pending.value.filter(c => (c.producer || '').toLowerCase().includes(q) || (c.project || '').toLowerCase().includes(q));
});

const pendingTotal = computed(() => pending.value.reduce((s, c) => s + Number(c.amount || 0), 0));
const approvedTotal = computed(() => approved.value.reduce((s, c) => s + Number(c.amount || 0), 0));

function approveCredit(credit) {
  // remover de pending e adicionar a approved
  const idx = pending.value.findIndex(p => p.id === credit.id);
  if (idx === -1) return;
  const item = pending.value.splice(idx, 1)[0];
  approved.value.unshift({ ...item, approvedAt: new Date().toISOString() });
  activities.value.unshift({ title: `Aprovado ${item.amount} ZEA por ${item.producer}`, time: 'agora' });
}

function rejectCredit(credit) {
  // pedir confirmação antes de rejeitar — permite ao admin optar por NÃO aprovar
  if (!confirm(`Deseja realmente rejeitar o registro de ${credit.producer || 'este produtor'}?`)) return;
  const idx = pending.value.findIndex(p => p.id === credit.id);
  if (idx === -1) return;
  const item = pending.value.splice(idx, 1)[0];
  activities.value.unshift({ title: `Rejeitado registro de ${item.producer} (${item.amount} ZEA)`, time: 'agora' });
}

function bulkApprove() {
  if (!pending.value.length) return alert('Nenhum crédito pendente');
  // mover todos
  const items = pending.value.splice(0, pending.value.length);
  items.forEach(i => approved.value.unshift({ ...i, approvedAt: new Date().toISOString() }));
  activities.value.unshift({ title: `Aprovados ${items.length} registros`, time: 'agora' });
}

function clearFilters() { search.value = ''; }
</script>

<style scoped>
.dashboard-root { padding: 24px; max-width: 1100px; margin: 0 auto; }
.dashboard-header { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:18px; }
.h1 { font-size:1.75rem; color: #13601a; margin:0; }
.sub { color:#4b5563; margin:4px 0 0; }
.search { padding:8px 12px; border-radius:8px; border:1px solid #f2dfdf; min-width:260px; }
.stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin: 12px 0 20px; }
.stat-card { background:white; padding:16px; border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,0.06); }
.stat-title { color:#16a34a; font-weight:600; }
.stat-value { font-size:1.4rem; margin-top:6px; color:#111827; }
.stat-sub { color:#6b7280; font-size:0.85rem; margin-top:8px; }
.main-grid { display:grid; grid-template-columns: 2fr 1fr; gap:16px; }
.card { background:white; padding:16px; border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,0.06); }
.card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.project-list { list-style:none; padding:0; margin:0; }
.activity-list { list-style:none; padding:0; margin:0; }
.activity-list li { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f3f4f6; }
.dot { width:10px; height:10px; border-radius:999px; background:#34d399; align-self:flex-start; margin-top:6px; }
.muted { color:#6b7280; font-size:0.9rem; }

/* botões utilitários (visibilidade e contraste) */
.btn-ghost { padding:8px 12px; border-radius:8px; background:transparent; border:1px solid #d1d5db; color:#065f46; cursor:pointer; }
.btn-ghost:hover { background:#f7fdf7; }

.btn-limpar { padding:8px 12px; border-radius:8px; background:#059669; color:white; border:none; cursor:pointer; }
.btn-limpar:hover { background:#047857; }

@media (max-width:900px) {
  .stats-grid { grid-template-columns:1fr; }
  .main-grid { grid-template-columns:1fr; }
}

</style>
