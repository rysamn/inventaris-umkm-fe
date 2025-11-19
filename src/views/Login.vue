<template>
  <div class="login-container">
    <div class="login-card">
      <div class="text-center mb-4">
        <i class="bi bi-box-seam-fill login-icon"></i>
        <h2 class="fw-bold">Inventaris UMKM</h2>
        <p class="text-muted">Silakan masuk untuk melanjutkan</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="credentials.namaPengguna"
            required
            placeholder="Masukkan username Anda"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="credentials.kataSandi"
            required
            placeholder="Masukkan password Anda"
          />
        </div>

        <div v-if="errorMessage" class="alert alert-danger py-2">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Masuk</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        namaPengguna: '',
        kataSandi: '',
      },
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await api.auth.login(this.credentials);
        const { token, ...userData } = response.data;

        if (token) {
          localStorage.setItem('token', token);
          // Simpan juga data pengguna ke localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          // Redirect ke dashboard setelah login berhasil
          this.$router.push('/');
        } else {
          this.errorMessage = 'Gagal mendapatkan token dari server.';
        }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.errorMessage = 'Username atau password salah.';
        } else {
          this.errorMessage = 'Terjadi kesalahan. Coba lagi nanti.';
          console.error('Login error:', error);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
.login-icon {
  font-size: 3rem;
  color: var(--bs-primary);
}
</style>