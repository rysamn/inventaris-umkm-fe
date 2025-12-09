<template>
  <div class="pemasok-page">

    <!-- POPUP NOTIFIKASI KANAN ATAS -->
    <transition name="fade-slide">
      <div v-if="popup.show" :class="['custom-popup', popup.type]">
        <i :class="popup.icon"></i>
        {{ popup.message }}
      </div>
    </transition>

    <!-- PANEL KONFIRMASI HAPUS DI TENGAH -->
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
          <i class="bi bi-truck text-success"></i> Manajemen Pemasok
        </h2>
        <button @click="showModal(null)" class="btn btn-success">
          <i class="bi bi-plus-circle me-2"></i> Tambah Pemasok
        </button>
      </div>

      <!-- Search Bar -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-white">
                  <i class="bi bi-search"></i>
                </span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Cari nama, telepon, alamat...">
              </div>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-danger" :disabled="selectedPemasokIds.length === 0" @click="confirmDeleteSelected">
                <i class="bi bi-trash me-1"></i> Hapus Terpilih
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Pemasok -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status"><span class="visually-hidden">Loading...</span></div>
          </div>

          <div v-else-if="filteredPemasok.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1"></i>
            <p class="mt-3">Tidak ada data pemasok</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                  </th>
                  <th>#</th>
                  <th>Nama Pemasok</th>
                  <th>Telepon</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pemasok, index) in filteredPemasok" :key="pemasok.id">
                  <td>
                    <input type="checkbox" :value="pemasok.id" v-model="selectedPemasokIds">
                  </td>
                  <td>{{ index + 1 }}</td>
                  <td><strong>{{ pemasok.nama }}</strong></td>
                  <td><i class="bi bi-telephone me-2"></i>{{ pemasok.telepon }}</td>
                  <td><i class="bi bi-geo-alt me-2"></i>{{ pemasok.alamat }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button @click="showModal(pemasok)" class="btn btn-outline-warning">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button @click="confirmDeleteSingle(pemasok)" class="btn btn-outline-danger">
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
                  <input v-model="form.nama" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Telepon *</label>
                  <input v-model="form.telepon" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Alamat *</label>
                  <textarea v-model="form.alamat" class="form-control" rows="3" required></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button type="button" @click="savePemasok" class="btn btn-success">
                <i class="bi bi-save me-2"></i> Simpan
              </button>
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
  name: 'PemasokView',
  data() {
    return {
      pemasokList: [],
      loading: false,
      searchQuery: '',
      form: { id: null, nama: '', telepon: '', alamat: '' },
      isEdit: false,
      modal: null,

      popup: { show: false, message: '', type: 'success', icon: '' },

      // HAPUS SINGLE/MULTI
      confirmDeleteShow: false,
      confirmDeleteMessage: '',
      confirmDeleteAction: null,

      selectedPemasokIds: [],
      selectAll: false
    }
  },
  computed: {
    filteredPemasok() {
      let result = this.pemasokList;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(p =>
          p.nama.toLowerCase().includes(q) ||
          p.telepon.includes(q) ||
          p.alamat.toLowerCase().includes(q)
        );
      }
      return result;
    }
  },
  mounted() {
    this.loadPemasok();
    this.modal = new Modal(document.getElementById('pemasokModal'));
  },
  methods: {
    showPopup(type, message) {
      this.popup.show = true;
      this.popup.type = type;
      this.popup.message = message;
      this.popup.icon = type === "success" ? "bi bi-check-circle" : "bi bi-x-circle";
      setTimeout(() => this.popup.show = false, 2500);
    },

    async loadPemasok() {
      this.loading = true;
      try {
        const res = await api.pemasok.getAll();
        this.pemasokList = res.data;
      } catch {
        this.showPopup("error", "Gagal memuat data pemasok");
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
        this.form = { id: null, nama: '', telepon: '', alamat: '' };
      }
      this.modal.show();
    },

    async savePemasok() {
      try {
        if (this.isEdit) {
          await api.pemasok.update(this.form.id, this.form);
          this.showPopup("success", "Pemasok berhasil diperbarui!");
        } else {
          await api.pemasok.create(this.form);
          this.showPopup("success", "Pemasok berhasil ditambahkan!");
        }
        this.modal.hide();
        this.loadPemasok();
      } catch {
        this.showPopup("error", "Gagal menyimpan pemasok");
      }
    },

    // SINGLE DELETE
    confirmDeleteSingle(pemasok) {
      this.confirmDeleteMessage = `Hapus pemasok "${pemasok.nama}"?`;
      this.confirmDeleteAction = async () => {
        try {
          await api.pemasok.delete(pemasok.id);
          this.showPopup("success", "Pemasok berhasil dihapus!");
          this.loadPemasok();
        } catch {
          this.showPopup("error", "Gagal menghapus pemasok");
        } finally {
          this.closeConfirmDelete();
        }
      };
      this.confirmDeleteShow = true;
    },

    // MULTI DELETE
    confirmDeleteSelected() {
      if (this.selectedPemasokIds.length === 0) return;
      this.confirmDeleteMessage = `Hapus ${this.selectedPemasokIds.length} pemasok terpilih?`;
      this.confirmDeleteAction = async () => {
        try {
          await Promise.all(this.selectedPemasokIds.map(id => api.pemasok.delete(id)));
          this.showPopup("success", `${this.selectedPemasokIds.length} pemasok berhasil dihapus!`);
          this.selectedPemasokIds = [];
          this.selectAll = false;
          this.loadPemasok();
        } catch {
          this.showPopup("error", "Gagal menghapus beberapa pemasok");
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
      if (this.selectAll) this.selectedPemasokIds = this.filteredPemasok.map(p => p.id);
      else this.selectedPemasokIds = [];
    }
  }
}
</script>

<style scoped>
.pemasok-page { padding: 20px; }

/* POPUP NOTIFIKASI KANAN ATAS */
.custom-popup {
  position: fixed;
  top: 20px; right: 20px;
  padding: 14px 22px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18);
}
.custom-popup.success { background: #28a745; }
.custom-popup.error { background: #dc3545; }

/* PANEL KONFIRMASI HAPUS TENGAH */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}
.confirm-panel {
  background: white;
  padding: 20px 25px;
  border-radius: 12px;
  min-width: 320px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

/* Blur content saat panel muncul */
.blur-bg {
  filter: blur(3px);
  pointer-events: none;
  user-select: none;
}

/* TRANSISI */
.fade-slide-enter-active,
.fade-slide-leave-active { transition: all 0.35s ease; }
.fade-slide-enter-from,
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
