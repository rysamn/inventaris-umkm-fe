<template>
  <nav class="navbar-modern bg-primary shadow-sm">
    <div class="navbar-container">
      <div class="navbar-brand">
        <i class="bi bi-box-seam brand-icon text-white"></i>
        <div class="brand-text text-white">
          <span class="brand-name">Cashier</span>
          <span class="brand-subtitle">UMKM System</span>
        </div>
      </div>

      <div class="navbar-actions">
        <div class="navbar-user bg-primary-light">
          <div class="user-avatar bg-white text-primary">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="user-info">
            <span class="user-name text-white">{{ userName }}</span>
            <span class="user-role badge bg-light text-primary">{{ userRole }}</span>
          </div>
        </div>

        <button @click="handleLogout" class="btn btn-outline-light">
          <i class="bi bi-box-arrow-right"></i>
          <span class="d-none d-md-inline ms-2">Logout</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- LOGOUT MODAL -->
  <div v-if="showLogoutModal" class="logout-overlay">
    <div class="logout-modal">

      <div class="logout-icon">
        <i class="bi bi-box-arrow-right"></i>
      </div>

      <h3 class="logout-title">Logout Account?</h3>
      <p class="logout-text">Are you sure want to logout your account?</p>

      <div class="logout-buttons">
        <button class="btn-cancel" @click="showLogoutModal = false">Cancel</button>

        <button class="btn-logout" @click="confirmLogout">
          <i class="bi bi-box-arrow-right me-1"></i>
          Logout
        </button>
      </div>

    </div>
  </div>
</template>


<script>
import api from '../services/api';

export default {
  name: 'AppNavbar',

  data() {
    return {
      showLogoutModal: false
    };
  },

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
      this.showLogoutModal = true;
    },

    confirmLogout() {
      api.auth.logout();
      this.$router.push('/login');
    }
  }
}
</script>


<style scoped>
.navbar-modern {
  position: sticky;
  top: 0;
  z-index: 1030;
  padding: 0.75rem 1.5rem;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 1.8rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 0.7rem;
  opacity: 0.9;
  text-transform: uppercase;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.user-role {
  font-size: 0.7rem;
}


/* ===================== */
/* LOGOUT MODAL STYLING  */
/* ===================== */

.logout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.logout-modal {
  background: white;
  width: 360px;
  padding: 25px 25px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  animation: pop 0.18s ease-out;
}

.logout-icon {
  width: 60px;
  height: 60px;
  background: #ffecec;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #e63946;
}

.logout-title {
  margin: 0;
  font-weight: 700;
  font-size: 20px;
}

.logout-text {
  margin-top: 4px;
  color: #666;
  font-size: 14px;
}

.logout-buttons {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.btn-cancel {
  flex: 1;
  padding: 10px 0;
  background: #eef1f5;
  border: none;
  border-radius: 10px;
  font-weight: 600;
}

.btn-logout {
  flex: 1;
  padding: 10px 0;
  background: linear-gradient(145deg, #ff4b4b, #e23030);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .brand-subtitle,
  .user-info {
    display: none;
  }
}
</style>
