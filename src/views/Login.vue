<template>
  <div class="login-page">
    <!-- Background Gradient -->
    <div class="gradient-background"></div>
    
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="branding-side">
        <div class="branding-content">
          <div class="logo-container">
            <img src="@/assets/logo.png" alt="Setarduck Logo" class="brand-logo" />
          </div>
          <h1 class="brand-title">Sistem Inventaris UMKM</h1>
          <p class="brand-subtitle">
            Kelola inventaris bisnis Anda dengan mudah dan efisien. 
            Sistem terintegrasi untuk UMKM modern.
          </p>
          <div class="features-list">
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Manajemen Stok Real-time</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Point of Sale (POS) Kasir</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Laporan & Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="form-side">
        <div class="login-card">
          <div class="card-header-custom">
            <h2 class="login-title">Log In</h2>
            <p class="login-subtitle">Selamat datang kembali! Silakan login untuk melanjutkan</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="username" class="form-label">
                <i class="bi bi-person"></i>
                Username
              </label>
              <input
                type="text"
                class="form-control custom-input"
                id="username"
                v-model="credentials.namaPengguna"
                required
                placeholder="Masukkan username"
                autofocus
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="bi bi-lock"></i>
                Password
              </label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control custom-input"
                  id="password"
                  v-model="credentials.kataSandi"
                  required
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <div class="remember-forgot">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="rememberMe" />
                  <span>Remember me</span>
                </label>
              </div>
            </div>

            <div v-if="errorMessage" class="alert alert-danger custom-alert">
              <i class="bi bi-exclamation-circle me-2"></i>
              {{ errorMessage }}
            </div>

            <button type="submit" class="btn-login" :disabled="loading">
              <span v-if="loading">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Memproses...
              </span>
              <span v-else>
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Log In
              </span>
            </button>
          </form>

          <div class="footer-links">
            <p class="copyright">
              © 2025 <strong>Superducc Team</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
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
      showPassword: false,
      rememberMe: false,
    };
  },
  created() {
    // Cek apakah ada username yang tersimpan di localStorage
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      this.credentials.namaPengguna = rememberedUser;
      this.rememberMe = true;
    }
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
          localStorage.setItem('user', JSON.stringify(userData));

          // Logika untuk "Remember Me"
          if (this.rememberMe) {
            localStorage.setItem('rememberedUser', this.credentials.namaPengguna);
          } else {
            localStorage.removeItem('rememberedUser');
          }
          
          // Redirect sesuai role
          if (userData.peran === 'kasir') {
            this.$router.push('/kasir');
          } else {
            this.$router.push('/');
          }
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
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Gradient Background - FIXED */
.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1381db 0%, #6799d6 100%);
  z-index: 0;
  pointer-events: none; /* Ini yang penting! */
}

.gradient-background::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveBackground 20s linear infinite;
  pointer-events: none; /* Ini juga penting */
}

@keyframes moveBackground {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Main Container */
.login-container {
  position: relative;
  z-index: 2; /* Pastikan lebih tinggi dari background */
  display: flex;
  width: 90%;
  max-width: 1100px;
  min-height: 600px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Branding Side - FIXED */
.branding-side {
  flex: 1;
  background: linear-gradient(135deg, #1381db 0%, #60a5fa 100%);
  padding: 60px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.branding-side::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
  background-size: 40px 40px;
  animation: rotateBackground 30s linear infinite;
  pointer-events: none; /* Ini yang diperbaiki */
}

@keyframes rotateBackground {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.branding-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.logo-container {
  margin-bottom: 30px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.brand-logo {
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.brand-subtitle {
  font-size: 1rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 40px;
}

.features-list {
  text-align: left;
  display: inline-block;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.feature-item i {
  font-size: 1.2rem;
  margin-right: 12px;
  color: #a8ff78;
}

/* Form Side */
.form-side {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  position: relative;
  z-index: 2; /* Pastikan form side bisa menerima event click */
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header-custom {
  margin-bottom: 40px;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #718096;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-label i {
  margin-right: 8px;
  color: #667eea;
}

.custom-input {
  height: 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3; /* Pastikan input di atas semua elemen */
}

.custom-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
  z-index: 4; /* Pastikan tombol toggle bisa diklik */
}

.password-toggle:hover {
  color: #667eea;
}

.remember-forgot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: #4a5568;
  font-size: 0.9rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.custom-alert {
  border-radius: 12px;
  border: none;
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.btn-login {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #1381db 0%, #60a5fa 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer-links {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.copyright {
  color: #718096;
  font-size: 0.85rem;
  margin: 0;
}

.copyright strong {
  color: #1381db;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
    width: 95%;
    max-width: 500px;
  }

  .branding-side {
    padding: 40px 30px;
  }

  .brand-logo {
    width: 120px;
    height: 120px;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .brand-subtitle {
    font-size: 0.9rem;
  }

  .features-list {
    display: none;
  }

  .form-side {
    padding: 40px 30px;
  }
}

@media (max-width: 576px) {
  .form-side {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .custom-input {
    height: 45px;
    font-size: 0.9rem;
  }

  .btn-login {
    height: 45px;
    font-size: 0.95rem;
  }
}
</style>