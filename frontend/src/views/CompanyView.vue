<template>
  <div class="dashboard-root">
    <header class="dashboard-header">
      <div>
        <h1 class="h1">Portal da Empresa 🏢</h1>
        <p class="sub">Compre créditos de carbono verificados</p>
      </div>
      <div class="header-actions">
        <input v-model="search" placeholder="Buscar por produtor, região..." class="search" />
      </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Saldo em Carteira</div>
        <div class="stat-value">{{ wallet }} ZEA</div>
        <div class="stat-sub">Última compra: {{ lastPurchase || '—' }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Créditos no Carrinho</div>
        <div class="stat-value">{{ cartTotal }} ZEA</div>
        <div class="stat-sub">{{ cart.length }} itens selecionados</div>
      </div>

      <div class="stat-card">
        <div class="stat-title">Total Investido</div>
        <div class="stat-value">{{ totalInvested }} ZEA</div>
        <div class="stat-sub">Em {{ purchases.length }} compras</div>
      </div>
    </section>

    <section class="main-grid">
      <div class="card">
        <div class="card-head">
          <h2>Créditos Disponíveis</h2>
          <div class="filters">
            <select v-model="filter" class="select">
              <option value="all">Todos</option>
              <option value="forest">Reflorestamento</option>
              <option value="agriculture">Agricultura</option>
              <option value="energy">Energia Limpa</option>
            </select>
            <button class="btn-ghost" @click="clearFilters">Limpar</button>
          </div>
        </div>

        <div class="credits-grid">
          <!-- Cards de créditos disponíveis -->
          <div v-for="credit in filteredCredits" :key="credit.id" class="credit-card">
            <div class="credit-type" :class="credit.type">{{ credit.typeLabel }}</div>
            <h3>{{ credit.producer }}</h3>
            <p class="location">{{ credit.location }}</p>
            <div class="details">
              <div class="amount">{{ credit.amount }} ZEA</div>
              <div class="price">R$ {{ credit.price }}/un</div>
            </div>
            <p class="description">{{ credit.description }}</p>
            <div class="card-actions">
              <input 
                type="number" 
                v-model.number="credit.buyAmount" 
                :max="credit.amount"
                min="0"
                class="amount-input"
                placeholder="Quantidade"
              />
              <button 
                class="btn-approve" 
                @click="addToCart(credit)"
                :disabled="!credit.buyAmount"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <!-- Carrinho -->
        <div class="card cart-card">
          <h2>Carrinho</h2>
          <div v-if="cart.length === 0" class="empty-cart">
            Nenhum crédito selecionado
          </div>
          <ul v-else class="cart-list">
            <li v-for="item in cart" :key="item.id" class="cart-item">
              <div class="cart-info">
                <strong>{{ item.producer }}</strong>
                <div class="muted">{{ item.amount }}x ZEA • R$ {{ item.price }}/un</div>
              </div>
              <button class="btn-ghost small" @click="removeFromCart(item)">
                Remover
              </button>
            </li>
          </ul>
          <div v-if="cart.length > 0" class="cart-footer">
            <div class="total">
              <span>Total:</span>
              <strong>R$ {{ cartTotalPrice }}</strong>
            </div>
            <button class="btn-approve" @click="checkout">Finalizar Compra</button>
          </div>
        </div>

        <!-- Histórico -->
        <div class="card history-card">
          <h2>Histórico de Compras</h2>
          <ul class="history-list">
            <li v-for="p in purchases" :key="p.id" class="history-item">
              <span class="dot"></span>
              <div>
                <strong>{{ p.credits }} ZEA</strong>
                <div class="muted">{{ p.date }} • R$ {{ p.total }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { produtores as produtoresApi, transacoes as transacoesApi, dashboard } from '../services/api';

const router = useRouter();

// Estado da empresa
const empresaId = ref('');
const wallet = ref(0);
const lastPurchase = ref('—');
const totalInvested = ref(0);

// Filtros
const search = ref('');
const filter = ref('all');

// Carrinho
const cart = ref([]);
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.amount, 0));
const cartTotalPrice = computed(() => 
  cart.value.reduce((sum, item) => sum + (item.amount * item.price), 0).toFixed(2)
);

// Créditos disponíveis
const credits = ref([]);

// Histórico de compras
const purchases = ref([]);

// Lifecycle
onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const tipo = localStorage.getItem('tipoUsuario');
  
  if (!usuario || tipo !== 'empresa') {
    router.push('/login');
    return;
  }

  empresaId.value = usuario.emailEmpresa || usuario.cnpj;
  
  await carregarDados();
});

// Methods
async function carregarDados() {
  try {
    // Carregar saldo
    const saldoRes = await dashboard.obterSaldo(empresaId.value);
    wallet.value = saldoRes.data.saldo || 0;

    // Carregar produtores disponíveis
    const produtoresRes = await produtoresApi.listar();
    credits.value = produtoresRes.data.produtores.map(p => ({
      id: p.cpfOuCnpj,
      producer: p.nomeCompleto,
      location: p.endereco,
      amount: p.creditos || 0,
      price: 45.00, // Preço fixo ou vindo do backend
      type: 'agriculture',
      typeLabel: p.atividade,
      description: `Créditos disponíveis do produtor ${p.nomeCompleto}`,
      buyAmount: 0
    }));

    // Carregar histórico de transações
    const transRes = await transacoesApi.listar(empresaId.value);
    const transacoes = transRes.data.transacoes || [];
    
    purchases.value = transacoes.map(t => ({
      id: t.id,
      credits: t.quantidade,
      total: t.valor.toFixed(2),
      date: new Date(t.data).toLocaleDateString('pt-BR')
    }));

    // Calcular estatísticas
    if (transacoes.length > 0) {
      totalInvested.value = transacoes.reduce((sum, t) => sum + t.valor, 0);
      lastPurchase.value = new Date(transacoes[0].data).toLocaleDateString('pt-BR');
    }

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    alert('Erro ao carregar dados. Tente novamente.');
  }
}

// Computed
const filteredCredits = computed(() => {
  let result = credits.value;
  
  // Filtro por tipo
  if (filter.value !== 'all') {
    result = result.filter(c => c.type === filter.value);
  }
  
  // Busca
  const query = search.value.toLowerCase().trim();
  if (query) {
    result = result.filter(c => 
      c.producer.toLowerCase().includes(query) ||
      c.location.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// Methods
function clearFilters() {
  search.value = '';
  filter.value = 'all';
}

function addToCart(credit) {
  if (!credit.buyAmount) return;
  
  // Verificar se já existe no carrinho
  const existing = cart.value.find(item => item.id === credit.id);
  if (existing) {
    existing.amount += credit.buyAmount;
  } else {
    cart.value.push({
      id: credit.id,
      producer: credit.producer,
      amount: credit.buyAmount,
      price: credit.price
    });
  }
  
  // Reduzir quantidade disponível
  credit.amount -= credit.buyAmount;
  credit.buyAmount = 0;
}

function removeFromCart(item) {
  const idx = cart.value.findIndex(i => i.id === item.id);
  if (idx === -1) return;
  
  // Devolver ao estoque
  const credit = credits.value.find(c => c.id === item.id);
  if (credit) {
    credit.amount += item.amount;
  }
  
  // Remover do carrinho
  cart.value.splice(idx, 1);
}

async function checkout() {
  if (!cart.value.length) return;
  
  try {
    // Criar transação para cada item do carrinho
    for (const item of cart.value) {
      await transacoesApi.comprar({
        empresaId: empresaId.value,
        produtorId: item.id,
        quantidade: item.amount,
        valor: item.amount * item.price
      });
    }

    alert(`Compra finalizada! ${cartTotal.value} ZEA adquiridos.`);
    
    // Limpar carrinho
    cart.value = [];
    
    // Recarregar dados
    await carregarDados();
    
  } catch (error) {
    console.error('Erro na compra:', error);
    alert('Erro ao finalizar compra. Tente novamente.');
  }
}
</script>

<style scoped>
.dashboard-root { padding: 24px; max-width: 1200px; margin: 0 auto; }

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.h1 { font-size: 1.75rem; color: #13601a; margin: 0; }
.sub { color: #4b5563; margin: 4px 0 0; }

.search, .select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  min-width: 200px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 12px 0 20px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(2,6,23,0.06);
}

.stat-title { color: #16a34a; font-weight: 600; }
.stat-value { font-size: 1.4rem; margin-top: 6px; color: #111827; }
.stat-sub { color: #6b7280; font-size: 0.85rem; margin-top: 8px; }

.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(2,6,23,0.06);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.credits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.credit-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.credit-type {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.credit-type.forest {
  background: #dcfce7;
  color: #166534;
}

.credit-type.agriculture {
  background: #fef9c3;
  color: #854d0e;
}

.credit-type.energy {
  background: #dbeafe;
  color: #1e40af;
}

.location {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 4px 0 8px;
}

.details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}

.amount {
  font-weight: 600;
  color: #065f46;
}

.price {
  color: #059669;
  font-weight: 600;
}

.description {
  color: #4b5563;
  font-size: 0.875rem;
  margin: 8px 0;
  min-height: 40px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.amount-input {
  width: 100px;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.cart-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #34d399;
  align-self: flex-start;
  margin-top: 6px;
}

.muted { color: #6b7280; font-size: 0.9rem; }

.btn-ghost.small {
  padding: 4px 8px;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>