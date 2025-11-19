<template>
  <div class="pelanggan-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-people text-primary"></i> Manajemen Pelanggan
      </h2>
      <button @click="showModal(null)" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>
        Tambah Pelanggan
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
                placeholder="Cari nama pelanggan..."
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Pelanggan -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>Nama Pelanggan</th>
              <th>Telepon</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pelangganList.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                Belum ada data pelanggan
              </td>
            </tr>
            <tr v-for="(item, index) in filteredPelanggan" :key="item.id">
              <td class="fw-bold">{{ index + 1 }}</td>
              <td>{{ item.namaPelanggan }}</td>
              <td>{{ item.telepon }}</td>
              <td>{{ item.alamat }}</td>
              <td>
                <button 
                  @click="showModal(item)" 
                  class="btn btn-sm btn-warning me-2"
                  title="Edit"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  @click="deletePelanggan(item.id)" 
                  class="btn btn-sm btn-danger"
                  title="Hapus"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="modalPelanggan" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nama Pelanggan</label>
              <input v-model="form.namaPelanggan" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Telepon</label>
              <input v-model="form.telepon" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Alamat</label>
              <textarea v-model="form.alamat" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button @click="savePelanggan" type="button" class="btn btn-primary">
              {{ isEdit ? 'Update' : 'Simpan' }}
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
  name: 'PelangganView',
  data() {
    return {
      pelangganList: [],
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
    filteredPelanggan() {
      return this.pelangganList.filter(item => {
        if (!item || !item.namaPelanggan) return false;
        return item.namaPelanggan.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const response = await api.pelanggan.getAll();
        this.pelangganList = response.data || [];
      } catch (error) {
        console.error('Error loading pelanggan:', error);
        alert('Gagal memuat data pelanggan');
      } finally {
        this.loading = false;
      }
    },
    showModal(item) {
      if (item) {
        this.form = { ...item };
        this.isEdit = true;
      } else {
        this.form = { id: null, namaPelanggan: '', telepon: '', alamat: '' };
        this.isEdit = false;
      }
      this.modal.show();
    },
    async savePelanggan() {
      try {
        if (this.isEdit) {
          await api.pelanggan.update(this.form.id, this.form);
        } else {
          await api.pelanggan.create(this.form);
        }
        this.modal.hide();
        this.loadData();
      } catch (error) {
        console.error('Error saving pelanggan:', error);
        alert('Gagal menyimpan data pelanggan');
      }
    },
    async deletePelanggan(id) {
      if (confirm('Yakin ingin menghapus data pelanggan ini?')) {
        try {
          await api.pelanggan.delete(id);
          this.loadData();
        } catch (error) {
          console.error('Error deleting pelanggan:', error);
          alert('Gagal menghapus data pelanggan');
        }
      }
    }
  },
  mounted() {
    this.modal = new Modal(document.getElementById('modalPelanggan'));
    this.loadData();
  }
}
</script>

<style scoped>
.pelanggan-page {
  padding: 20px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
