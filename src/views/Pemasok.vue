<template>
  <div class="pemasok-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-truck text-success"></i> Manajemen Pemasok
      </h2>
      <button @click="showModal(null)" class="btn btn-success">
        <i class="bi bi-plus-circle me-2"></i>
        Tambah Pemasok
      </button>
    </div>

    <!-- Search Bar -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text bg-white">
            <i class="bi bi-search"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Cari nama pemasok, telepon, atau alamat..."
          >
        </div>
      </div>
    </div>

    <!-- Tabel Pemasok -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="filteredPemasok.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-3">Tidak ada data pemasok</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Nama Pemasok</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pemasok, index) in filteredPemasok" :key="pemasok.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ pemasok.nama }}</strong>
                </td>
                <td>
                  <i class="bi bi-telephone me-2"></i>
                  {{ pemasok.telepon }}
                </td>
                <td>
                  <i class="bi bi-geo-alt me-2"></i>
                  {{ pemasok.alamat }}
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button @click="showModal(pemasok)" class="btn btn-outline-warning">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button @click="confirmDelete(pemasok)" class="btn btn-outline-danger">
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
    <div class="modal fade" id="pemasokModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="isEdit ? 'bi bi-pencil' : 'bi bi-plus-circle'" class="me-2"></i>
              {{ isEdit ? 'Edit Pemasok' : 'Tambah Pemasok Baru' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePemasok">
              <div class="mb-3">
                <label class="form-label">Nama Pemasok *</label>
                <input 
                  v-model="form.nama" 
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Contoh: PT. Sumber Jaya"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Telepon *</label>
                <input 
                  v-model="form.telepon" 
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Contoh: 081234567890"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Alamat *</label>
                <textarea 
                  v-model="form.alamat" 
                  class="form-control" 
                  rows="3" 
                  required
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Batal
            </button>
            <button type="button" @click="savePemasok" class="btn btn-success">
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
  name: 'PemasokView',
  data() {
    return {
      pemasokList: [],
      loading: false,
      searchQuery: '',
      form: {
        id: null,
        nama: '',
        telepon: '',
        alamat: ''
      },
      isEdit: false,
      modal: null
    }
  },
  computed: {
    filteredPemasok() {
      if (!this.searchQuery) return this.pemasokList;
      
      const query = this.searchQuery.toLowerCase();
      return this.pemasokList.filter(p => 
        p.nama.toLowerCase().includes(query) ||
        p.telepon.includes(query) ||
        p.alamat.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.loadPemasok();
    this.modal = new Modal(document.getElementById('pemasokModal'));
  },
  methods: {
    async loadPemasok() {
      this.loading = true;
      try {
        const response = await api.pemasok.getAll();
        this.pemasokList = response.data;
      } catch (error) {
        console.error('Error loading pemasok:', error);
        alert('Gagal memuat data pemasok');
      } finally {
        this.loading = false;
      }
    },

    showModal(pemasok) {
      if (pemasok) {
        this.isEdit = true;
        this.form = { ...pemasok };
      } else {
        this.isEdit = false;
        this.form = {
          id: null,
          nama: '',
          telepon: '',
          alamat: ''
        };
      }
      this.modal.show();
    },

    async savePemasok() {
      try {
        if (this.isEdit) {
          await api.pemasok.update(this.form.id, this.form);
          alert('Pemasok berhasil diupdate!');
        } else {
          await api.pemasok.create(this.form);
          alert('Pemasok berhasil ditambahkan!');
        }
        this.modal.hide();
        this.loadPemasok();
      } catch (error) {
        console.error('Error saving pemasok:', error);
        alert('Gagal menyimpan pemasok');
      }
    },

    async confirmDelete(pemasok) {
      if (confirm(`Hapus pemasok "${pemasok.nama}"?`)) {
        try {
          await api.pemasok.delete(pemasok.id);
          alert('Pemasok berhasil dihapus!');
          this.loadPemasok();
        } catch (error) {
          console.error('Error deleting pemasok:', error);
          alert('Gagal menghapus pemasok');
        }
      }
    }
  }
}
</script>

<style scoped>
.pemasok-page {
  padding: 20px;
}
</style>