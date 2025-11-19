<template>
  <nav class="navbar navbar-dark bg-primary sticky-top shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <i class="bi bi-box-seam me-2 fs-4"></i>
        <span class="fw-bold">Sistem Inventaris UMKM</span>
      </a>
      <div class="d-flex align-items-center text-white">
        <span class="me-3">
          <i class="bi bi-person-circle me-2"></i>
          <span class="d-none d-md-inline">{{ userName }}</span>
          <span class="badge bg-light text-primary ms-2">{{ userRole }}</span>
        </span>
        <button @click="handleLogout" class="btn btn-outline-light btn-sm">
          <i class="bi bi-box-arrow-right me-1"></i>
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import api from '../services/api';

export default {
  name: 'AppNavbar',
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user') || '{}');
    },
    userName() {
      return this.user.namaPengguna || 'User';
    },
    userRole() {
      return this.user.peran ? this.user.peran.toUpperCase() : 'GUEST';
    }
  },
  methods: {
    handleLogout() {
      if (confirm('Yakin ingin logout?')) {
        api.auth.logout();
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  z-index: 1030;
}
</style>        