<template>
  <div class="kasir-page">
    <h2 class="fw-bold mb-4">
      <i class="bi bi-cash-register text-success"></i> Point of Sale (POS)
    </h2>

    <div class="row g-4">
      <!-- Panel Kiri: Produk & Keranjang -->
      <div class="col-md-8">
        <!-- Search Produk -->
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <div class="input-group">
              <span class="input-group-text bg-white">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Cari produk atau scan barcode..."
                @keyup.enter="searchProduk"
              >
              <button @click="searchProduk" class="btn btn-primary">
                <i class="bi bi-search"></i> Cari
              </button>
            </div>
          </div>
        </div>

        <!-- Daftar Produk -->
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-header bg-white">
            <h5 class="mb-0">Daftar Produk</h5>
          </div>
          <div class="card-body" style="max-height: 300px; overflow-y: auto;">
            <div class="row g-2">
              <div 
                v-for="produk in filteredProduk" 
                :key="produk.id"
                class="col-md-4 col-6"
              >
                <div 
                  class="produk-card p-3 border rounded cursor-pointer"
                  @click="addToCart(produk)"
                  :class="{ 'border-primary': selectedProduk?.id === produk.id }"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0 small">{{ produk.namaProduk }}</h6>
                    <span :class="getStokBadge(produk.stok)">
                      {{ produk.stok }}
                    </span>
                  </div>
                  <p class="text-muted small mb-1">{{ produk.namaKategori }}</p>
                  <h6 class="text-success mb-0">Rp {{ formatRupiah(produk.harga) }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Keranjang Belanja -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-cart3"></i> Keranjang Belanja ({{ cart.length }} item)
            </h5>
          </div>
          <div class="card-body">
            <div v-if="cart.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-cart-x fs-1"></i>
              <p class="mt-2">Keranjang masih kosong</p>
            </div>

            <div v-else>
              <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                <table class="table table-sm">
                  <thead class="sticky-top bg-white">
                    <tr>
                      <th>Produk</th>
                      <th width="80">Qty</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                      <th width="50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in cart" :key="index">
                      <td>{{ item.namaProduk }}</td>
                      <td>
                        <div class="input-group input-group-sm">
                          <button 
                            @click="updateQty(index, -1)" 
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            <i class="bi bi-dash"></i>
                          </button>
                          <input 
                            v-model.number="item.qty" 
                            type="number" 
                            class="form-control text-center"
                            min="1"
                            @change="calculateSubtotal(item)"
                          >
                          <button 
                            @click="updateQty(index, 1)" 
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            <i class="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td>{{ formatRupiah(item.harga) }}</td>
                      <td class="fw-bold">{{ formatRupiah(item.subtotal) }}</td>
                      <td>
                        <button 
                          @click="removeFromCart(index)" 
                          class="btn btn-sm btn-danger"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Kanan: Pembayaran -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm sticky-top" style="top: 20px;">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-calculator"></i> Total Pembayaran
            </h5>
          </div>
          <div class="card-body">
            <!-- Pelanggan -->
            <div class="mb-3">
              <label class="form-label">Pelanggan</label>
              <select v-model="selectedPelanggan" class="form-select">
                <option :value="null">Umum / Walk-in</option>
                <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                  {{ pelanggan.namaPelanggan }}
                </option>
              </select>
            </div>

            <!-- Summary -->
            <div class="border-top border-bottom py-3 mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Total Item:</span>
                <strong>{{ totalItems }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>Rp {{ formatRupiah(totalBelanja) }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Diskon:</span>
                <div class="input-group input-group-sm" style="max-width: 150px;">
                  <input 
                    v-model.number="diskon" 
                    type="number" 
                    class="form-control"
                    min="0"
                    :max="totalBelanja"
                  >
                </div>
              </div>
            </div>

            <!-- Total Akhir -->
            <div class="bg-success text-white p-3 rounded mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">TOTAL:</h5>
                <h3 class="mb-0">Rp {{ formatRupiah(totalAkhir) }}</h3>
              </div>
            </div>

            <!-- Pembayaran -->
            <div class="mb-3">
              <label class="form-label">Bayar:</label>
              <input 
                v-model.number="bayar" 
                type="number" 
                class="form-control form-control-lg"
                placeholder="Masukkan jumlah bayar"
                min="0"
              >
            </div>

            <!-- Kembalian -->
            <div class="alert alert-info mb-3">
              <div class="d-flex justify-content-between">
                <strong>Kembalian:</strong>
                <strong class="text-primary">Rp {{ formatRupiah(kembalian) }}</strong>
              </div>
            </div>

            <!-- Tombol Aksi -->
            <div class="d-grid gap-2">
              <button 
                @click="prosesTransaksi" 
                class="btn btn-success btn-lg"
                :disabled="cart.length === 0 || bayar < totalAkhir || loading"
              >
                <i class="bi bi-check-circle me-2"></i>
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  Memproses...
                </span>
                <span v-else>Bayar & Cetak Struk</span>
              </button>
              <button 
                @click="clearCart" 
                class="btn btn-outline-danger"
                :disabled="cart.length === 0"
              >
                <i class="bi bi-x-circle me-2"></i>
                Batal / Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Sukses -->
    <div class="modal fade" id="modalSukses" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>
              Transaksi Berhasil!
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
            <h4 class="mt-3">Pembayaran Berhasil</h4>
            <p class="text-muted">Transaksi telah tersimpan</p>
            <div class="alert alert-info">
              <strong>No. Invoice:</strong> {{ lastInvoiceNumber }}
            </div>
          </div>
          <div class="modal-footer">
            <button @click="cetakStruk" class="btn btn-primary">
              <i class="bi bi-printer me-2"></i>
              Cetak Struk
            </button>
            <button @click="closeModalAndReset" class="btn btn-success" data-bs-dismiss="modal">
              <i class="bi bi-arrow-right me-2"></i>
              Transaksi Baru
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
  name: 'KasirView',
  data() {
    return {
      produkList: [],
      pelangganList: [],
      cart: [],
      searchQuery: '',
      selectedProduk: null,
      selectedPelanggan: null,
      diskon: 0,
      bayar: 0,
      loading: false,
      lastPenjualanId: null,
      lastInvoiceNumber: '',
      modalSukses: null
    }
  },
  computed: {
    filteredProduk() {
      if (!this.searchQuery) return this.produkList;
      
      const query = this.searchQuery.toLowerCase();
      return this.produkList.filter(p => 
        p.namaProduk.toLowerCase().includes(query) ||
        p.namaKategori.toLowerCase().includes(query)
      );
    },
    totalItems() {
      return this.cart.reduce((sum, item) => sum + item.qty, 0);
    },
    totalBelanja() {
      return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
    },
    totalAkhir() {
      return Math.max(0, this.totalBelanja - this.diskon);
    },
    kembalian() {
      return Math.max(0, this.bayar - this.totalAkhir);
    }
  },
  mounted() {
    this.loadProduk();
    this.loadPelanggan();
    this.modalSukses = new Modal(document.getElementById('modalSukses'));
  },
  methods: {
    async loadProduk() {
      try {
        const response = await api.produk.getAll();
        this.produkList = response.data.filter(p => p.stok > 0); // Hanya tampilkan produk yang stoknya > 0
      } catch (error) {
        console.error('Error loading produk:', error);
        alert('Gagal memuat data produk');
      }
    },

    async loadPelanggan() {
      try {
        const response = await api.pelanggan.getAll();
        this.pelangganList = response.data;
      } catch (error) {
        console.error('Error loading pelanggan:', error);
      }
    },

    searchProduk() {
      // Fungsi untuk handle search atau barcode scan
      if (this.searchQuery.startsWith('PROD-')) {
        // Jika format barcode
        const productId = parseInt(this.searchQuery.replace('PROD-', ''));
        const produk = this.produkList.find(p => p.id === productId);
        if (produk) {
          this.addToCart(produk);
          this.searchQuery = '';
        } else {
          alert('Produk tidak ditemukan!');
        }
      }
    },

    addToCart(produk) {
      if (produk.stok <= 0) {
        alert('Stok produk habis!');
        return;
      }

      const existingIndex = this.cart.findIndex(item => item.idProduk === produk.id);
      
      if (existingIndex > -1) {
        // Jika produk sudah ada, tambah qty
        if (this.cart[existingIndex].qty < produk.stok) {
          this.cart[existingIndex].qty++;
          this.calculateSubtotal(this.cart[existingIndex]);
        } else {
          alert('Stok tidak mencukupi!');
        }
      } else {
        // Tambah produk baru ke cart
        this.cart.push({
          idProduk: produk.id,
          namaProduk: produk.namaProduk,
          harga: produk.harga,
          qty: 1,
          subtotal: produk.harga,
          stokTersedia: produk.stok
        });
      }

      this.selectedProduk = produk;
    },

    updateQty(index, delta) {
      const item = this.cart[index];
      const newQty = item.qty + delta;
      
      if (newQty <= 0) {
        this.removeFromCart(index);
        return;
      }
      
      if (newQty > item.stokTersedia) {
        alert('Stok tidak mencukupi!');
        return;
      }
      
      item.qty = newQty;
      this.calculateSubtotal(item);
    },

    calculateSubtotal(item) {
      item.subtotal = item.harga * item.qty;
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
    },

    clearCart() {
      if (confirm('Yakin ingin membatalkan transaksi ini?')) {
        this.cart = [];
        this.selectedPelanggan = null;
        this.diskon = 0;
        this.bayar = 0;
        this.searchQuery = '';
      }
    },

    async prosesTransaksi() {
      if (this.cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
      }

      if (this.bayar < this.totalAkhir) {
        alert('Jumlah bayar kurang!');
        return;
      }

      this.loading = true;

      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        
        // Get pelanggan ID atau buat pelanggan umum kalau belum ada
        let pelangganId = this.selectedPelanggan;
        
        if (!pelangganId) {
          // Cek apakah pelanggan "Umum" sudah ada
          const pelangganUmum = this.pelangganList.find(p => p.namaPelanggan === 'Umum');
          
          if (pelangganUmum) {
            pelangganId = pelangganUmum.id;
          } else {
            // Buat pelanggan umum baru
            try {
              const newPelanggan = {
                namaPelanggan: 'Umum',
                telepon: '-',
                alamat: 'Walk-in Customer'
              };
              await api.pelanggan.create(newPelanggan);
              await this.loadPelanggan(); // Reload pelanggan
              
              const pelangganBaru = this.pelangganList.find(p => p.namaPelanggan === 'Umum');
              pelangganId = pelangganBaru.id;
            } catch (err) {
              // Jika gagal buat, pakai ID 1 sebagai fallback
              pelangganId = 1;
            }
          }
        }
        
        // Prepare data penjualan
        const penjualanData = {
          idPelanggan: pelangganId,
          idPengguna: userData.id,
          total: this.totalAkhir,
          detailPenjualan: this.cart.map(item => ({
            idProduk: item.idProduk,
            jumlah: item.qty,
            harga: item.harga
          }))
        };

        // POST ke API penjualan
        await api.penjualan.create(penjualanData);
        
        // Ambil ID penjualan dari response atau ambil terakhir
        const penjualanListResponse = await api.penjualan.getAll();
        const lastPenjualan = penjualanListResponse.data[0]; // Asumsi sorted DESC
        
        this.lastPenjualanId = lastPenjualan.id;
        this.lastInvoiceNumber = `INV-${String(lastPenjualan.id).padStart(6, '0')}`;

        // Tampilkan modal sukses
        this.modalSukses.show();

        // Reload produk untuk update stok
        await this.loadProduk();

      } catch (error) {
        console.error('Error proses transaksi:', error);
        alert('Gagal memproses transaksi: ' + (error.response?.data || error.message));
      } finally {
        this.loading = false;
      }
    },

    cetakStruk() {
      if (!this.lastPenjualanId) {
        alert('Tidak ada transaksi untuk dicetak');
        return;
      }

      // Buka struk di tab baru
      const printUrl = `http://localhost:8080/api/invoice/print/${this.lastPenjualanId}`;
      window.open(printUrl, '_blank');
    },

    closeModalAndReset() {
      this.cart = [];
      this.selectedPelanggan = null;
      this.diskon = 0;
      this.bayar = 0;
      this.searchQuery = '';
      this.lastPenjualanId = null;
      this.lastInvoiceNumber = '';
    },

    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    },

    getStokBadge(stok) {
      if (stok === 0) return 'badge bg-danger';
      if (stok < 10) return 'badge bg-warning text-dark';
      return 'badge bg-success';
    }
  }
}
</script>

<style scoped>
.kasir-page {
  padding: 20px;
}

.produk-card {
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
}

.produk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #0d6efd !important;
}

.cursor-pointer {
  cursor: pointer;
}

.sticky-top {
  position: sticky;
  top: 20px;
  z-index: 100;
}
</style>