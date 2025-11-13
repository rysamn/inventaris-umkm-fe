<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <div class="produk-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-box text-primary"></i> Manajemen Produk
      </h2>
      <button @click="showModal(null)" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>
        Tambah Produk
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Cari nama produk..."
              >
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filterKategori" class="form-select">
              <option value="">Semua Kategori</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Alat Tulis">Alat Tulis</option>
              <option value="Elektronik">Elektronik</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filterStok" class="form-select">
              <option value="">Semua Stok</option>
              <option value="tersedia">Stok Tersedia (&gt; 0)</option>
              <option value="menipis">Stok Menipis (&lt; 10)</option>
              <option value="habis">Stok Habis (0)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Produk -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="filteredProduk.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-3">Tidak ada data produk</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Satuan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(produk, index) in filteredProduk" :key="produk.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ produk.namaProduk }}</strong>
                </td>
                <td>
                  <span class="badge bg-secondary">{{ produk.namaKategori }}</span>
                </td>
                <td>Rp {{ formatRupiah(produk.harga) }}</td>
                <td>
                  <span :class="getStokBadgeClass(produk.stok)">
                    {{ produk.stok }}
                  </span>
                </td>
                <td>{{ produk.satuan }}</td>
                <td>
                  <span :class="getStatusBadge(produk.stok)">
                    {{ getStatusText(produk.stok) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button @click="showModal(produk)" class="btn btn-outline-warning">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button @click="confirmDelete(produk)" class="btn btn-outline-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="produkModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="isEdit ? 'bi bi-pencil' : 'bi bi-plus-circle'" class="me-2"></i>
              {{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduk">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nama Produk *</label>
                  <input 
                    v-model="form.namaProduk" 
                    type="text" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Kategori *</label>
                  <select v-model="form.namaKategori" class="form-select" required>
                    <option value="">Pilih Kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Alat Tulis">Alat Tulis</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Harga *</label>
                  <input 
                    v-model.number="form.harga" 
                    type="number" 
                    class="form-control" 
                    required
                    min="0"
                  >
                </div>
                <div class="col-md-4">
                  <label class="form-label">Stok *</label>
                  <input 
                    v-model.number="form.stok" 
                    type="number" 
                    class="form-control" 
                    required
                    min="0"
                  >
                </div>
                <div class="col-md-4">
                  <label class="form-label">Satuan *</label>
                  <select v-model="form.satuan" class="form-select" required>
                    <option value="">Pilih Satuan</option>
                    <option value="pcs">pcs</option>
                    <option value="box">box</option>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="unit">unit</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Batal
            </button>
            <button type="button" @click="saveProduk" class="btn btn-primary">
              <i class="bi bi-save me-2"></i>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { Modal } from 'bootstrap';

export default {
  name: 'ProdukView',
  data() {
    return {
      produkList: [],
      loading: false,
      searchQuery: '',
      filterKategori: '',
      filterStok: '',
      form: {
        id: null,
        namaProduk: '',
        harga: 0,
        stok: 0,
        satuan: '',
        namaKategori: ''
      },
      isEdit: false,
      modal: null
    }
  },
  computed: {
    filteredProduk() {
      let result = this.produkList;

      // Filter by search
      if (this.searchQuery) {
        result = result.filter(p => 
          p.namaProduk.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by kategori
      if (this.filterKategori) {
        result = result.filter(p => p.namaKategori === this.filterKategori);
      }

      // Filter by stok
      if (this.filterStok === 'tersedia') {
        result = result.filter(p => p.stok > 0);
      } else if (this.filterStok === 'menipis') {
        result = result.filter(p => p.stok > 0 && p.stok < 10);
      } else if (this.filterStok === 'habis') {
        result = result.filter(p => p.stok === 0);
      }

      return result;
    }
  },
  mounted() {
    this.loadProduk();
    this.modal = new Modal(document.getElementById('produkModal'));
  },
  methods: {
    async loadProduk() {
      this.loading = true;
      try {
        const response = await api.produk.getAll();
        this.produkList = response.data;
      } catch (error) {
        console.error('Error loading produk:', error);
        alert('Gagal memuat data produk');
      } finally {
        this.loading = false;
      }
    },
    
    showModal(produk) {
      if (produk) {
        this.isEdit = true;
        this.form = { ...produk };
      } else {
        this.isEdit = false;
        this.form = {
          id: null,
          namaProduk: '',
          harga: 0,
          stok: 0,
          satuan: '',
          namaKategori: ''
        };
      }
      this.modal.show();
    },

    async saveProduk() {
      try {
        if (this.isEdit) {
          await api.produk.update(this.form.id, this.form);
          alert('Produk berhasil diupdate!');
        } else {
          await api.produk.create(this.form);
          alert('Produk berhasil ditambahkan!');
        }
        this.modal.hide();
        this.loadProduk();
      } catch (error) {
        console.error('Error saving produk:', error);
        alert('Gagal menyimpan produk');
      }
    },

    async confirmDelete(produk) {
      if (confirm(`Hapus produk "${produk.namaProduk}"?`)) {
        try {
          await api.produk.delete(produk.id);
          alert('Produk berhasil dihapus!');
          this.loadProduk();
        } catch (error) {
          console.error('Error deleting produk:', error);
          alert('Gagal menghapus produk');
        }
      }
    },

    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    },

    getStokBadgeClass(stok) {
      if (stok === 0) return 'badge bg-danger';
      if (stok < 10) return 'badge bg-warning text-dark';
      return 'badge bg-success';
    },

    getStatusBadge(stok) {
      if (stok === 0) return 'badge bg-danger';
      if (stok < 10) return 'badge bg-warning text-dark';
      return 'badge bg-success';
    },

    getStatusText(stok) {
      if (stok === 0) return 'Habis';
      if (stok < 10) return 'Menipis';
      return 'Tersedia';
    }
  }
}
</script>

<style scoped>
.produk-page {
  padding: 20px;
}

.table-responsive {
  max-height: 600px;
  overflow-y: auto;
}
</style>