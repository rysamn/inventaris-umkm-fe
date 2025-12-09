<template>
  <div class="produk-page">

    <!-- POPUP NOTIFIKASI -->
    <transition name="fade-slide">
      <div v-if="popup.show" :class="['custom-popup', popup.type]">
        <i :class="popup.icon"></i>
        {{ popup.message }}
      </div>
    </transition>

    <!-- HEADER -->
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
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Cari nama produk...">
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filterKategori" class="form-select">
              <option value="">Semua Kategori</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Alat Tulis">Alat Tulis</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Lainnya">Lainnya</option>
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

    <!-- TOMBOL HAPUS TERPILIH -->
    <div class="mb-2">
      <button 
        class="btn btn-danger" 
        :disabled="selectedProdukIds.length === 0" 
        @click="confirmDeleteSelected"
      >
        <i class="bi bi-trash me-1"></i> Hapus Terpilih
      </button>
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
                <th>
                  <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                </th>
                <th>#</th>
                <th>Foto</th>
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
                <td>
                  <input type="checkbox" :value="produk.id" v-model="selectedProdukIds">
                </td>
                <td>{{ index + 1 }}</td>
                <td>
                  <img v-if="produk.fotoProduk" :src="api.produk.getFotoUrl(produk.fotoProduk)" alt="Foto Produk" class="img-thumbnail" style="width:50px;height:50px;object-fit:cover;">
                  <span v-else class="badge bg-light text-dark"><i class="bi bi-image"></i> No Image</span>
                </td>
                <td><strong>{{ produk.namaProduk }}</strong></td>
                <td><span class="badge bg-secondary">{{ produk.namaKategori }}</span></td>
                <td>Rp {{ formatRupiah(produk.harga) }}</td>
                <td><span :class="getStokBadgeClass(produk.stok)">{{ produk.stok }}</span></td>
                <td>{{ produk.satuan }}</td>
                <td><span :class="getStatusBadge(produk.stok)">{{ getStatusText(produk.stok) }}</span></td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button @click="showModal(produk)" class="btn btn-outline-warning"><i class="bi bi-pencil"></i></button>
                    <button @click="confirmDelete(produk)" class="btn btn-outline-danger"><i class="bi bi-trash"></i></button>
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
                  <input v-model="form.namaProduk" type="text" class="form-control" required>
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
                  <input v-model.number="form.harga" type="number" class="form-control" required min="0">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Stok *</label>
                  <input v-model.number="form.stok" type="number" class="form-control" required min="0">
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
                <div class="col-12">
                  <label class="form-label">Foto Produk</label>
                  <input @change="handleFileUpload" type="file" class="form-control" accept="image/*" :disabled="uploadingFoto">
                  <small class="text-muted">Format: JPG, PNG, GIF (Max 5MB)</small>
                </div>
                <div v-if="fotoPreview" class="col-12">
                  <div class="d-flex align-items-center gap-3">
                    <img :src="fotoPreview" class="img-thumbnail" style="max-width:150px; max-height:150px; object-fit:cover;">
                    <div v-if="uploadingFoto" class="spinner-border text-primary"></div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" @click="saveProduk" class="btn btn-primary" :disabled="uploadingFoto">
              <i class="bi bi-save me-2"></i> Simpan
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL KONFIRMASI DELETE -->
    <div v-if="confirmDeleteShow" class="confirm-overlay">
      <div class="confirm-box">
        <h5 class="mb-3"><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> Konfirmasi Hapus</h5>
        <p>{{ confirmDeleteMessage }}</p>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-secondary" @click="closeConfirmDelete">Batal</button>
          <button class="btn btn-danger" @click="deleteConfirmed">Hapus</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../services/api';
import { Modal } from 'bootstrap';

export default {
  name:'ProdukView',
  data(){
    return {
      api,
      produkList:[],
      loading:false,
      searchQuery:'',
      filterKategori:'',
      filterStok:'',
      form:{ id:null, namaProduk:'', harga:0, stok:0, satuan:'', namaKategori:'', fotoProduk:null },
      isEdit:false,
      modal:null,
      fotoPreview:null,
      uploadingFoto:false,
      popup:{ show:false, type:'success', message:'', icon:'' },

      // HAPUS MULTI
      selectedProdukIds:[],
      selectAll:false,

      // KONFIRMASI DELETE
      confirmDeleteShow:false,
      confirmDeleteMessage:'',
      confirmDeleteAction:null
    }
  },
  computed:{
    filteredProduk(){
      let result = this.produkList;
      if(this.searchQuery) result = result.filter(p=>p.namaProduk.toLowerCase().includes(this.searchQuery.toLowerCase()));
      if(this.filterKategori) result = result.filter(p=>p.namaKategori===this.filterKategori);
      if(this.filterStok==='tersedia') result = result.filter(p=>p.stok>0);
      if(this.filterStok==='menipis') result = result.filter(p=>p.stok>0 && p.stok<10);
      if(this.filterStok==='habis') result = result.filter(p=>p.stok===0);
      return result;
    }
  },
  mounted(){
    this.loadProduk();
    this.modal = new Modal(document.getElementById('produkModal'));
  },
  methods:{
    showPopup(type,message){
      this.popup.type = type;
      this.popup.message = message;
      this.popup.icon = type==='success'?'bi bi-check-circle':'bi bi-x-circle';
      this.popup.show=true;
      setTimeout(()=>this.popup.show=false,2500);
    },
    async loadProduk(){
      this.loading=true;
      try{
        const res = await api.produk.getAll();
        this.produkList=res.data;
      }catch(err){ this.showPopup('error','Gagal memuat produk'); }
      finally{ this.loading=false; }
    },
    showModal(produk){
      if(produk){
        this.isEdit=true;
        this.form={...produk};
        this.fotoPreview = produk.fotoProduk ? api.produk.getFotoUrl(produk.fotoProduk) : null;
      }else{
        this.isEdit=false;
        this.form={ id:null, namaProduk:'', harga:0, stok:0, satuan:'', namaKategori:'', fotoProduk:null };
        this.fotoPreview=null;
      }
      this.modal.show();
    },
    async saveProduk(){
      try{
        if(this.isEdit){
          await api.produk.update(this.form.id,this.form);
          this.showPopup('success','Produk berhasil diupdate');
        }else{
          await api.produk.create(this.form);
          this.showPopup('success','Produk berhasil ditambahkan');
        }
        this.loadProduk();
        this.modal.hide();
      }catch(err){ this.showPopup('error','Gagal menyimpan produk'); }
    },
    async handleFileUpload(e){
      const file = e.target.files[0];
      if(!file) return;
      if(file.size>5*1024*1024){ this.showPopup('error','Ukuran max 5MB'); e.target.value=''; return; }
      this.uploadingFoto=true;
      try{
        const base64 = await api.produk.fileToBase64(file);
        this.form.fotoProduk=base64;
        const reader = new FileReader();
        reader.onload=(ev)=>this.fotoPreview=ev.target.result;
        reader.readAsDataURL(file);
      }catch(err){ this.showPopup('error','Gagal upload foto'); e.target.value=''; }
      finally{ this.uploadingFoto=false; }
    },

    // =======================
    // HAPUS SINGLE
    // =======================
    confirmDelete(produk){
      this.confirmDeleteMessage = `Hapus produk "${produk.namaProduk}"?`;
      this.confirmDeleteAction = async () => {
        try {
          await api.produk.delete(produk.id);
          this.showPopup('success','Produk berhasil dihapus');
          this.loadProduk();
        } catch(err){
          this.showPopup('error','Gagal menghapus produk');
        } finally {
          this.closeConfirmDelete();
        }
      };
      this.confirmDeleteShow = true;
    },

    // =======================
    // HAPUS MASSAL
    // =======================
    confirmDeleteSelected(){
      if(this.selectedProdukIds.length===0) return;
      this.confirmDeleteMessage = `Hapus ${this.selectedProdukIds.length} produk terpilih?`;
      this.confirmDeleteAction = async () => {
        try{
          await Promise.all(this.selectedProdukIds.map(id=>api.produk.delete(id)));
          this.showPopup('success',`${this.selectedProdukIds.length} produk berhasil dihapus`);
          this.selectedProdukIds=[];
          this.selectAll=false;
          this.loadProduk();
        }catch(err){ this.showPopup('error','Gagal hapus beberapa produk'); }
        finally{ this.closeConfirmDelete(); }
      };
      this.confirmDeleteShow = true;
    },

    deleteConfirmed(){
      if(this.confirmDeleteAction) this.confirmDeleteAction();
    },

    closeConfirmDelete(){
      this.confirmDeleteShow=false;
      this.confirmDeleteMessage='';
      this.confirmDeleteAction=null;
    },

    // =======================
    // MULTI SELECT
    // =======================
    toggleSelectAll(){
      if(this.selectAll) this.selectedProdukIds = this.filteredProduk.map(p=>p.id);
      else this.selectedProdukIds=[];
    },

    formatRupiah(v){ return new Intl.NumberFormat('id-ID').format(v); },
    getStokBadgeClass(stok){ return stok===0?'badge bg-danger':stok<10?'badge bg-warning text-dark':'badge bg-success'; },
    getStatusBadge(stok){ return this.getStokBadgeClass(stok); },
    getStatusText(stok){ return stok===0?'Habis':stok<10?'Menipis':'Tersedia'; }
  }
}
</script>

<style scoped>
.produk-page{padding:20px;}
.table-responsive{max-height:600px;overflow-y:auto;}
.custom-popup{position:fixed;top:20px;right:20px;padding:14px 22px;border-radius:10px;color:white;font-weight:600;display:flex;align-items:center;gap:10px;z-index:9999;box-shadow:0 4px 18px rgba(0,0,0,0.18);}
.custom-popup.success{background:#28a745;}
.custom-popup.error{background:#dc3545;}
.fade-slide-enter-active,.fade-slide-leave-active{transition:all 0.35s ease;}
.fade-slide-enter-from,.fade-slide-leave-to{opacity:0;transform:translateY(-10px);}

/* CONFIRM DELETE OVERLAY */
.confirm-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.3);
  backdrop-filter:blur(5px);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1050;
}
.confirm-box{
  background:white;
  padding:20px 25px;
  border-radius:10px;
  width:400px;
  max-width:90%;
  box-shadow:0 4px 18px rgba(0,0,0,0.25);
}
</style>
