import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Produk from '../views/Produk.vue'
import Pemasok from '../views/Pemasok.vue'
import Pelanggan from '../views/Pelanggan.vue'
import Barcode from '../views/Barcode.vue'
import Kasir from '../views/Kasir.vue'
import Transaksi from '../views/Transaksi.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/produk',
    name: 'Produk',
    component: Produk,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/pemasok',
    name: 'Pemasok',
    component: Pemasok,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/pelanggan',
    name: 'Pelanggan',
    component: Pelanggan,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/barcode',
    name: 'Barcode',
    component: Barcode,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/kasir',
    name: 'Kasir',
    component: Kasir,
    meta: { requiresAuth: true, roles: ['admin', 'kasir'] }
  },
  {
    path: '/transaksi',
    name: 'Transaksi',
    component: Transaksi,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.peran;

  if (to.meta.requiresAuth && !loggedIn) {
    // Jika rute butuh auth dan tidak ada token, redirect ke login
    next('/login');
  } else if (to.path === '/login' && loggedIn) {
    // Jika sudah login dan coba akses login, redirect sesuai role
    if (userRole === 'kasir') {
      next('/kasir');
    } else {
      next('/');
    }
  } else if (to.path === '/register' && loggedIn) {
    next('/');
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // Jika role tidak sesuai, redirect
    if (userRole === 'kasir') {
      next('/kasir');
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router