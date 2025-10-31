// Imports no topo
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import DashboardView from '../views/DashboardView.vue';
import AdminView from '../views/AdminView.vue';
import CompanyView from '../views/CompanyView.vue';

// Definição das rotas
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/admin', name: 'Admin', component: AdminView },
  { path: '/company', name: 'Company', component: CompanyView },
];

// Criação do router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
