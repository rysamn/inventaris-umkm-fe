<template>
  <div class="dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-speedometer2 text-primary"></i> Dashboard
      </h2>
      <button @click="loadData" class="btn btn-outline-primary">
        <i class="bi bi-arrow-clockwise"></i> Refresh
      </button>
    </div>

    <!-- Alert Peringatan -->
    <div v-if="alertStokMinim.length > 0" class="alert alert-warning alert-dismissible fade show" role="alert">
      <h5 class="alert-heading">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Peringatan Stok Minimum!
      </h5>
      <p class="mb-0">Ada {{ alertStokMinim.length }} produk dengan stok di bawah minimum.</p>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>

    <div v-if="alertKadaluarsa.length > 0" class="alert alert-danger alert-dismissible fade show" role="alert">
      <h5 class="alert-heading">
        <i class="bi bi-exclamation-octagon-fill me-2"></i>
        Alert Kadaluarsa!
      </h5>
      <p class="mb-0">Ada {{ alertKadaluarsa.length }} produk yang akan kadaluarsa dalam 7 hari.</p>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>

    <!-- Cards Statistik -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Total Produk</p>
                <h3 class="fw-bold mb-0">{{ stats.totalProduk }}</h3>
              </div>
              <div class="icon-box bg-primary">
                <i class="bi bi-box text-white fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Stok Menipis</p>
                <h3 class="fw-bold mb-0 text-warning">{{ stats.stokMinim }}</h3>
              </div>
              <div class="icon-box bg-warning">
                <i class="bi bi-exclamation-triangle text-white fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Total Pemasok</p>
                <h3 class="fw-bold mb-0">{{ stats.totalPemasok }}</h3>
              </div>
              <div class="icon-box bg-success">
                <i class="bi bi-truck text-white fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Total Pelanggan</p>
                <h3 class="fw-bold mb-0">{{ stats.totalPelanggan }}</h3>
              </div>
              <div class="icon-box bg-info">
                <i class="bi bi-people text-white fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Stok Menipis -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="bi bi-exclamation-circle text-warning me-2"></i>
              Produk Stok Minimum
            </h5>
          </div>
          <div class="card-body">
            <div v-if="alertStokMinim.length === 0" class="text-center text-muted py-3">
              <i class="bi bi-check-circle fs-1"></i>
              <p class="mt-2">Semua stok aman!</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Stok</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in alertStokMinim" :key="item.id">
                    <td>{{ item.namaProduk }}</td>
                    <td>
                      <span class="badge bg-danger">{{ item.stok }} {{ item.satuan }}</span>
                    </td>
                    <td>
                      <span class="badge bg-warning text-dark">Perlu Restock</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Produk Mendekati Kadaluarsa -->
      <div class="col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="bi bi-calendar-x text-danger me-2"></i>
              Reminder Kadaluarsa (H-7)
            </h5>
          </div>
          <div class="card-body">
            <div v-if="alertKadaluarsa.length === 0" class="text-center text-muted py-3">
              <i class="bi bi-check-circle fs-1"></i>
              <p class="mt-2">Tidak ada produk yang akan kadaluarsa!</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Tanggal</th>
                    <th>Sisa Hari</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in alertKadaluarsa" :key="item.id">
                    <td>{{ item.namaProduk }}</td>
                    <td>{{ item.tanggalKadaluarsa }}</td>
                    <td>
                      <span class="badge bg-danger">{{ item.sisaHari }} hari</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'DashboardView',
  data() {
    return {
      loading: false,
      stats: {
        totalProduk: 0,
        stokMinim: 0,
        totalPemasok: 0,
        totalPelanggan: 0
      },
      alertStokMinim: [],
      alertKadaluarsa: []
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // Load semua data
        const [produkRes, pemasokRes, pelangganRes] = await Promise.all([
          api.produk.getAll(),
          api.pemasok.getAll(),
          api.pelanggan.getAll()
        ]);

        const produkData = produkRes.data;
        
        // Hitung statistik
        this.stats.totalProduk = produkData.length;
        this.stats.totalPemasok = pemasokRes.data.length;
        this.stats.totalPelanggan = pelangganRes.data.length;
        
        // Filter produk dengan stok minimum (< 10)
        this.alertStokMinim = produkData.filter(p => p.stok < 10);
        this.stats.stokMinim = this.alertStokMinim.length;

        // Simulasi data kadaluarsa (karena belum ada field tanggal kadaluarsa di DB)
        // Nanti bisa ditambahkan field tanggalKadaluarsa di tabel produk
        this.alertKadaluarsa = [];
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Gagal memuat data dashboard. Pastikan backend berjalan!');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.table-responsive {
  max-height: 300px;
  overflow-y: auto;
}
</style>