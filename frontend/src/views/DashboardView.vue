<template>
  <div class="dashboard-root">
    <header class="dashboard-header">
      <div>
        <h1 class="h1">Olá, Produtor(a) 🌱</h1>
        <p class="sub">Visão geral do ecossistema GreenFarm</p>
      </div>
      <div class="header-actions">
        <input
          v-model="search"
          placeholder="Buscar projeto, empresa ou usuário..."
          class="search"
        />
      </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Saldo de Créditos</div>
        <div class="stat-value">{{ credits }} ZEA</div>
        <div class="stat-sub">Atualizado há {{ lastUpdate }} min</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Empresas Cadastradas</div>
        <div class="stat-value">{{ companies }}</div>
        <div class="stat-sub">Ativas: {{ companiesActive }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Projetos</div>
        <div class="stat-value">{{ projects.length }}</div>
        <div class="stat-sub">Em progresso: {{ projects.filter(p => !p.finished).length }}</div>
      </div>
    </section>

    <section class="main-grid">
      <div class="card projects-card">
        <div class="card-head">
          <h2>Projetos Recentes</h2>
          <div style="display:flex; gap:8px; align-items:center;">
            <ButtonGreen @click="openNewProject = !openNewProject">Novo Projeto</ButtonGreen>
            <button class="btn-ghost" @click="openCreditModal = true">Registrar Créditos</button>
          </div>
        </div>

        <div v-if="openNewProject" class="new-project">
          <InputField v-model="newProject.name" placeholder="Nome do projeto" />
          <InputField v-model="newProject.summary" placeholder="Resumo curto" />
          <div class="row">
            <ButtonGreen @click="addProject">Adicionar</ButtonGreen>
            <button class="btn-ghost" @click="openNewProject = false">Cancelar</button>
          </div>
        </div>

        <!-- Modal de Registro de Créditos -->
        <div v-if="openCreditModal" class="modal-overlay">
          <div class="modal">
            <header class="modal-header">
              <h3>Registrar Créditos (Produtor)</h3>
              <button class="close" @click="openCreditModal = false">✕</button>
            </header>
            <form class="modal-body" @submit.prevent="registerCredits">
              <InputField v-model="creditForm.producer" placeholder="Nome do Produtor" />

              <label class="label">Projeto</label>
              <select v-model="creditForm.projectId" class="select">
                <option value="">(Selecionar projeto opcional)</option>
                <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>

              <InputField v-model="creditForm.amount" type="number" placeholder="Quantidade de créditos" />

              <label class="label">Data</label>
              <input type="date" v-model="creditForm.date" class="input-date" />

              <label class="label">Observação</label>
              <InputField v-model="creditForm.note" placeholder="Observação (opcional)" />

              <div class="row" style="margin-top:12px;">
                <ButtonGreen @click="registerCredits">Registrar</ButtonGreen>
                <button type="button" class="btn-ghost" @click="openCreditModal = false">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <ul class="project-list">
          <li v-for="p in filteredProjects" :key="p.id" class="project-item">
            <div class="project-info">
              <strong>{{ p.name }}</strong>
              <p class="muted">{{ p.summary }}</p>
            </div>
            <div class="project-meta">
              <div class="progress">
                <div class="bar" :style="{ width: p.progress + '%' }"></div>
              </div>
              <div class="percent">{{ p.progress }}%</div>
            </div>
          </li>
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
import InputField from '../components/InputField.vue';
import ButtonGreen from '../components/ButtonGreen.vue';

const credits = ref(120);
const lastUpdate = ref(5);
const companies = ref(34);
const companiesActive = ref(29);

const projects = ref([
  { id: 1, name: 'Reflorestamento Amazônico', summary: 'Plantio de 10k mudas nativas', progress: 65, finished: false },
  { id: 2, name: 'Horta Comunitária SP', summary: 'Horta urbana e cursos', progress: 90, finished: false },
  { id: 3, name: 'Captura de Carbono - MG', summary: 'Monitoramento e sequestro', progress: 40, finished: false },
]);

const activities = ref([
  { title: 'Usuário maria adicionou um novo projeto', time: '2h atrás' },
  { title: 'Empresa AgroVerde validada', time: '5h atrás' },
  { title: 'Créditos transferidos para conta ZEA-123', time: '1 dia atrás' },
]);

const search = ref('');
const openNewProject = ref(false);
const newProject = ref({ name: '', summary: '' });

// Modal de criação de projeto (mantido)
function addProject() {
  if (!newProject.value.name) return alert('Informe o nome do projeto');
  projects.value.unshift({
    id: Date.now(),
    name: newProject.value.name,
    summary: newProject.value.summary || '—',
    progress: 0,
    finished: false,
  });
  newProject.value = { name: '', summary: '' };
  openNewProject.value = false;
}

// --- Registro de créditos (Produtor) ---
const openCreditModal = ref(false);
const creditForm = ref({ producer: '', projectId: '', amount: '', date: '', note: '' });

function registerCredits() {
  const amt = Number(creditForm.value.amount || 0);
  if (!creditForm.value.producer) return alert('Informe o nome do produtor');
  if (!amt || amt <= 0) return alert('Informe uma quantidade válida de créditos');

  // atualiza saldo global
  credits.value = Number(credits.value) + amt;

  // se projeto selecionado, adiciona expectedCredits no projeto (se existir)
  if (creditForm.value.projectId) {
    const pid = Number(creditForm.value.projectId);
    const proj = projects.value.find(p => p.id === pid);
    if (proj) {
      proj.expectedCredits = (Number(proj.expectedCredits) || 0) + amt;
    }
  }

  // registra atividade
  activities.value.unshift({ title: `Produtor ${creditForm.value.producer} registrou ${amt} créditos`, time: 'agora' });

  // feedback simples e reset
  alert(`Créditos registrados: ${amt} ZEA`);
  creditForm.value = { producer: '', projectId: '', amount: '', date: '', note: '' };
  openCreditModal.value = false;
}

const filteredProjects = computed(() => {
  if (!search.value) return projects.value;
  const q = search.value.toLowerCase();
  return projects.value.filter(p => p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
});
</script>

<style scoped>
.dashboard-root { padding: 24px; max-width: 1100px; margin: 0 auto; }
.dashboard-header { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:18px; }
.h1 { font-size:1.75rem; color: #13601a; margin:0; }
.sub { color:#4b5563; margin:4px 0 0; }
.search { padding:8px 12px; border-radius:8px; border:1px solid #d1d5db; min-width:260px; }
.stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin: 12px 0 20px; }
.stat-card { background:white; padding:16px; border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,0.06); }
.stat-title { color:#16a34a; font-weight:600; }
.stat-value { font-size:1.4rem; margin-top:6px; color:#111827; }
.stat-sub { color:#6b7280; font-size:0.85rem; margin-top:8px; }
.main-grid { display:grid; grid-template-columns: 2fr 1fr; gap:16px; }
.card { background:white; padding:16px; border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,0.06); }
.card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.new-project .row { display:flex; gap:10px; margin-top:10px; }
.btn-ghost { padding:8px 12px; border-radius:8px; background:transparent; border:1px solid #d1d5db; cursor:pointer; }
.project-list { list-style:none; padding:0; margin:0; }
.project-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #eef2f7; }
.project-info .muted { color:#6b7280; font-size:0.9rem; margin-top:4px; }
.project-meta { display:flex; align-items:center; gap:8px; min-width:160px; }
.progress { width:100%; background:#edf2f7; height:8px; border-radius:999px; overflow:hidden; }
.bar { height:100%; background:linear-gradient(90deg,#34d399,#059669); }
.percent { font-weight:600; color:#065f46; width:48px; text-align:right; }
.activity-list { list-style:none; padding:0; margin:0; }
.activity-list li { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f3f4f6; }
.dot { width:10px; height:10px; border-radius:999px; background:#34d399; align-self:flex-start; margin-top:6px; }
.muted { color:#6b7280; font-size:0.9rem; }

@media (max-width:900px) {
  .stats-grid { grid-template-columns:1fr; }
  .main-grid { grid-template-columns:1fr; }
}
</style>
