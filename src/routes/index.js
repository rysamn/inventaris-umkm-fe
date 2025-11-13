import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Produk from '../views/Produk.vue'
import Pemasok from '../views/Pemasok.vue'
import Pelanggan from '../views/Pelanggan.vue'
import Barcode from '../views/Barcode.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/produk',
    name: 'Produk',
    component: Produk
  },
  {
    path: '/pemasok',
    name: 'Pemasok',
    component: Pemasok
  },
  {
    path: '/pelanggan',
    name: 'Pelanggan',
    component: Pelanggan
  },
  {
    path: '/barcode',
    name: 'Barcode',
    component: Barcode
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router