<template>
  <div class="pelanggan-page">

    <!-- POPUP NOTIFIKASI KANAN ATAS -->
    <transition name="fade-slide">
      <div v-if="popup.show" :class="['custom-popup', popup.type]">
        <i :class="popup.icon"></i>
        {{ popup.message }}
      </div>
    </transition>

    <!-- PANEL KONFIRMASI HAPUS -->
    <transition name="fade-slide">
      <div v-if="confirmDeleteShow" class="overlay">
        <div class="confirm-panel">
          <p>{{ confirmDeleteMessage }}</p>
          <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-secondary me-2" @click="closeConfirmDelete">Batal</button>
            <button class="btn btn-danger" @click="deleteConfirmed">Hapus</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ISI PAGE -->
    <div :class="{ 'blur-bg': confirmDeleteShow }">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold">
          <i class="bi bi-people text-primary"></i> Manajemen Pelanggan
        </h2>
        <button @click="showModal(null)" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i> Tambah Pelanggan
        </button>
      </div>

      <!-- Search & Multi Delete -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-white">
                  <i class="bi bi-search"></i>
                </span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Cari nama pelanggan...">
              </div>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-danger" :disabled="selectedPelangganIds.length === 0" @click="confirmDeleteSelected">
                <i class="bi bi-trash me-1"></i> Hapus Terpilih
              </button>
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
                <th>
                  <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                </th>
                <th>No</th>
                <th>Nama Pelanggan</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredPelanggan.length === 0">
                <td colspan="6" class="text-center text-muted py-4">Belum ada data pelanggan</td>
              </tr>
              <tr v-for="(item, index) in filteredPelanggan" :key="item.id">
                <td>
                  <input type="checkbox" :value="item.id" v-model="selectedPelangganIds">
                </td>
                <td class="fw-bold">{{ index + 1 }}</td>
                <td>{{ item.namaPelanggan }}</td>
                <td>{{ item.telepon }}</td>
                <td>{{ item.alamat }}</td>
                <td>
                  <button @click="showModal(item)" class="btn btn-sm btn-warning me-2" title="Edit">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="confirmDeleteSingle(item)" class="btn btn-sm btn-danger" title="Hapus">
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
              <button @click="savePelanggan" type="button" class="btn btn-primary">{{ isEdit ? 'Update' : 'Simpan' }}</button>
            </div>
          </div>
        </div>
      </div>

    </div> <!-- end blur-bg wrapper -->

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
      form: { id: null, namaPelanggan: '', telepon: '', alamat: '' },
      isEdit: false,
      modal: null,

      // Popup
      popup: { show: false, message: '', type: 'success', icon: '' },

      // Delete single/multi
      confirmDeleteShow: false,
      confirmDeleteMessage: '',
      confirmDeleteAction: null,
      selectedPelangganIds: [],
      selectAll: false
    }
  },
  computed: {
    filteredPelanggan() {
      let list = this.pelangganList;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(p => p.namaPelanggan.toLowerCase().includes(q));
      }
      return list;
    }
  },
  mounted() {
    this.modal = new Modal(document.getElementById('modalPelanggan'));
    this.loadData();
  },
  methods: {
    showPopup(type, message) {
      this.popup.show = true;
      this.popup.type = type;
      this.popup.message = message;
      this.popup.icon = type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle';
      setTimeout(() => this.popup.show = false, 2500);
    },

    async loadData() {
      this.loading = true;
      try {
        const res = await api.pelanggan.getAll();
        this.pelangganList = res.data || [];
      } catch {
        this.showPopup('error', 'Gagal memuat data pelanggan');
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
          this.showPopup('success', 'Data pelanggan berhasil diperbarui!');
        } else {
          await api.pelanggan.create(this.form);
          this.showPopup('success', 'Data pelanggan berhasil ditambahkan!');
        }
        this.modal.hide();
        this.loadData();
      } catch {
        this.showPopup('error', 'Gagal menyimpan data pelanggan');
      }
    },

    // SINGLE DELETE
    confirmDeleteSingle(item) {
      this.confirmDeleteMessage = `Hapus pelanggan "${item.namaPelanggan}"?`;
      this.confirmDeleteAction = async () => {
        try {
          await api.pelanggan.delete(item.id);
          this.showPopup('success', 'Data pelanggan berhasil dihapus!');
          this.loadData();
        } catch {
          this.showPopup('error', 'Gagal menghapus pelanggan');
        } finally {
          this.closeConfirmDelete();
        }
      };
      this.confirmDeleteShow = true;
    },

    // MULTI DELETE
    confirmDeleteSelected() {
      if (this.selectedPelangganIds.length === 0) return;
      this.confirmDeleteMessage = `Hapus ${this.selectedPelangganIds.length} pelanggan terpilih?`;
      this.confirmDeleteAction = async () => {
        try {
          await Promise.all(this.selectedPelangganIds.map(id => api.pelanggan.delete(id)));
          this.showPopup('success', `${this.selectedPelangganIds.length} pelanggan berhasil dihapus!`);
          this.selectedPelangganIds = [];
          this.selectAll = false;
          this.loadData();
        } catch {
          this.showPopup('error', 'Gagal menghapus beberapa pelanggan');
        } finally {
          this.closeConfirmDelete();
        }
      };
      this.confirmDeleteShow = true;
    },

    deleteConfirmed() {
      if (this.confirmDeleteAction) this.confirmDeleteAction();
    },

    closeConfirmDelete() {
      this.confirmDeleteShow = false;
      this.confirmDeleteMessage = '';
      this.confirmDeleteAction = null;
    },

    toggleSelectAll() {
      if (this.selectAll) this.selectedPelangganIds = this.filteredPelanggan.map(p => p.id);
      else this.selectedPelangganIds = [];
    }
  }
}
</script>

<style scoped>
.pelanggan-page { padding: 20px; }

/* POPUP */
.custom-popup {
  position: fixed; top: 20px; right: 20px;
  padding: 14px 22px; border-radius: 10px;
  color: white; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  z-index: 9999; box-shadow: 0 4px 18px rgba(0,0,0,0.18);
}
.custom-popup.success { background: #28a745; }
.custom-popup.error { background: #dc3545; }

/* PANEL HAPUS */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 9998;
}
.confirm-panel {
  background: white; padding: 20px 25px; border-radius: 12px;
  min-width: 320px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

/* Blur konten saat panel muncul */
.blur-bg {
  filter: blur(3px);
  pointer-events: none;
  user-select: none;
}

/* Transisi */
.fade-slide-enter-active,
.fade-slide-leave-active { transition: all 0.35s ease; }
.fade-slide-enter-from,
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
