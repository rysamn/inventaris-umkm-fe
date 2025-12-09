<template>
  <nav :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="toggle-btn" @click="$emit('toggle')">
      <i class="bi bi-layout-sidebar-inset"></i>
    </div>

    <div class="position-sticky pt-3">
      <ul v-if="isAdmin" class="nav flex-column">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="bi bi-speedometer2 me-2"></i>
            <span v-if="!isCollapsed">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/kasir" class="nav-link" active-class="active">
            <i class="bi bi-cash me-2"></i>
            <span v-if="!isCollapsed">Kasir</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/produk" class="nav-link" active-class="active">
            <i class="bi bi-box me-2"></i>
            <span v-if="!isCollapsed">Produk</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/pemasok" class="nav-link" active-class="active">
            <i class="bi bi-truck me-2"></i>
            <span v-if="!isCollapsed">Pemasok</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/pelanggan" class="nav-link" active-class="active">
            <i class="bi bi-people me-2"></i>
            <span v-if="!isCollapsed">Pelanggan</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/transaksi" class="nav-link" active-class="active">
            <i class="bi bi-receipt me-2"></i>
            <span v-if="!isCollapsed">Transaksi</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/barcode" class="nav-link" active-class="active">
            <i class="bi bi-upc-scan me-2"></i>
            <span v-if="!isCollapsed">Barcode</span>
          </router-link>
        </li>
      </ul>

      <ul v-else-if="isKasir" class="nav flex-column">
        <li class="nav-item">
          <router-link to="/kasir" class="nav-link" active-class="active">
            <i class="bi bi-cash me-2"></i>
            <span v-if="!isCollapsed">Kasir</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/transaksi" class="nav-link" active-class="active">
            <i class="bi bi-receipt me-2"></i>
            <span v-if="!isCollapsed">Riwayat</span>
          </router-link>
        </li>
      </ul>

      <hr class="my-3" v-if="!isCollapsed">

      <div class="px-3 user-box" v-if="!isCollapsed">
        <p class="text-muted small mb-1">
          <i class="bi bi-person-circle me-1"></i> {{ userName }}
        </p>
        <span class="badge" :class="roleBadgeClass">{{ userRole }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: ['isCollapsed'],
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user') || '{}');
    },
    userName() {
      return this.user.namaPengguna || 'User';
    },
    userRole() {
      return this.user.peran || 'guest';
    },
    isAdmin() {
      return this.userRole === 'admin';
    },
    isKasir() {
      return this.userRole === 'kasir';
    },
    roleBadgeClass() {
      return this.isAdmin ? 'bg-danger' : 'bg-info';
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #f8f9fa;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  transition: width 0.3s;
  position: relative;
}

/* Lebar saat sidebar collapsed (hanya ikon) */
.sidebar.collapsed {
  width: 70px;
}

.toggle-btn {
  position: absolute;
  top: 15px;
  right: -15px;
  background: #fff;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
}

.toggle-btn i {
  font-size: 18px;
}

.nav-link {
  color: #495057;
  padding: 0.75rem 1rem;
  transition: 0.2s;
  /* Tambahkan display: flex untuk mengatur ikon dan teks */
  display: flex;
  align-items: center;
  white-space: nowrap; /* Mencegah teks melompat ke baris baru saat collapsed */
  overflow: hidden; /* Sembunyikan overflow saat collapsed */
}

.nav-link:hover {
  background: #e9ecef;
}

.nav-link.active {
  background: #0d6efd;
  color: white;
}

/* Style untuk nav-link saat collapsed */
.sidebar.collapsed .nav-link {
    padding: 0.75rem 0.5rem; /* Sesuaikan padding agar ikon terpusat */
    justify-content: center; /* Pusatkan ikon jika teks hilang */
}

/* Hilangkan margin ikon di mode collapsed agar ikon lebih merapat ke kiri */
.sidebar.collapsed .nav-link .me-2 {
    margin-right: 0 !important;
}

.user-box {
  font-size: 14px;
}

/* Sembunyikan HR dan user-box saat collapsed */
.sidebar.collapsed .my-3,
.sidebar.collapsed .user-box {
    display: none;
}
</style>