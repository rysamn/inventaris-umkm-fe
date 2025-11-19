<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="text-center mb-4 fw-bold">
        <i class="bi bi-person-plus-fill text-primary"></i> Buat Akun Baru
      </h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="namaPengguna" class="form-label">Nama Pengguna</label>
          <input
            type="text"
            class="form-control"
            id="namaPengguna"
            v-model="form.namaPengguna"
            required
          />
        </div>
        <div class="mb-3">
          <label for="kataSandi" class="form-label">Kata Sandi</label>
          <input
            type="password"
            class="form-control"
            id="kataSandi"
            v-model="form.kataSandi"
            required
          />
        </div>
        <div class="mb-3">
          <label for="peran" class="form-label">Peran</label>
          <select class="form-select" id="peran" v-model="form.peran" required>
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
          </select>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Mendaftar...' : 'Daftar' }}
          </button>
        </div>
      </form>
      <div class="text-center mt-3">
        <p>Sudah punya akun? <router-link to="/login">Masuk di sini</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        namaPengguna: '',
        kataSandi: '',
        peran: 'kasir', // Default role
      },
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = '';
      try {
        await api.auth.register(this.form);
        alert('Registrasi berhasil! Silakan login.');
        this.$router.push('/login');
      } catch (err) {
        this.error = 'Gagal mendaftar. Nama pengguna mungkin sudah ada atau terjadi kesalahan server.';
        console.error('Registration error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}
.register-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>