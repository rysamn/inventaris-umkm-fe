import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Produk from '../views/Produk.vue'
import Pemasok from '../views/Pemasok.vue'
import Pelanggan from '../views/Pelanggan.vue'
import Barcode from '../views/Barcode.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, hideNavbar: true } // Tidak memerlukan otentikasi
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false, hideNavbar: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Memerlukan otentikasi
  },
  {
    path: '/produk',
    name: 'Produk',
    component: Produk,
    meta: { requiresAuth: true }
  },
  {
    path: '/pemasok',
    name: 'Pemasok',
    component: Pemasok,
    meta: { requiresAuth: true }
  },
  {
    path: '/pelanggan',
    name: 'Pelanggan',
    component: Pelanggan,
    meta: { requiresAuth: true }
  },
  {
    path: '/barcode',
    name: 'Barcode',
    component: Barcode,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  if (to.meta.requiresAuth && !loggedIn) {
    // Jika rute butuh auth dan tidak ada token, redirect ke login
    next('/login');
  } else if (to.path === '/login' && loggedIn) {
    // Jika sudah login dan mencoba akses halaman login, redirect ke dashboard
    next('/');
  } else if (to.path === '/register' && loggedIn) {
    // Jika sudah login dan mencoba akses halaman register, redirect ke dashboard
    next('/');
  } else {
    next();
  }
});

export default router