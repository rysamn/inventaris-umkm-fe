<template>
  <div class="barcode-page">
    <h2 class="fw-bold mb-4">
      <i class="bi bi-upc-scan text-primary"></i> Barcode & Struk Belanja
    </h2>

    <div class="row g-4">
      <!-- Barcode Generator -->
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-upc me-2"></i>
              Barcode Generator
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Pilih Produk</label>
              <select v-model="selectedProdukId" class="form-select" @change="generateBarcode">
                <option value="">-- Pilih Produk --</option>
                <option v-for="produk in produkList" :key="produk.id" :value="produk.id">
                  {{ produk.namaProduk }} - Rp {{ formatRupiah(produk.harga) }}
                </option>
              </select>
            </div>

            <div v-if="selectedProduk" class="text-center">
              <div class="barcode-container mb-3">
                <svg id="barcode"></svg>
              </div>
              <div class="product-info mb-3">
                <h5>{{ selectedProduk.namaProduk }}</h5>
                <p class="text-muted mb-1">Kategori: {{ selectedProduk.namaKategori }}</p>
                <p class="text-muted mb-1">Stok: {{ selectedProduk.stok }} {{ selectedProduk.satuan }}</p>
                <h4 class="text-primary">Rp {{ formatRupiah(selectedProduk.harga) }}</h4>
              </div>
              <button @click="printBarcode" class="btn btn-primary">
                <i class="bi bi-printer me-2"></i>
                Cetak Barcode
              </button>
            </div>

            <div v-else class="text-center text-muted py-5">
              <i class="bi bi-upc fs-1"></i>
              <p class="mt-3">Pilih produk untuk generate barcode</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Struk Belanja -->
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-receipt me-2"></i>
              Struk Belanja
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Tambah Item</label>
              <div class="input-group">
                <select v-model="cartProdukId" class="form-select">
                  <option value="">-- Pilih Produk --</option>
                  <option v-for="produk in produkList" :key="produk.id" :value="produk.id">
                    {{ produk.namaProduk }}
                  </option>
                </select>
                <input 
                  v-model.number="cartQty" 
                  type="number" 
                  class="form-control" 
                  placeholder="Qty"
                  min="1"
                  style="max-width: 80px"
                >
                <button @click="addToCart" class="btn btn-success">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>

            <div v-if="cart.length === 0" class="text-center text-muted py-5">
              <i class="bi bi-cart fs-1"></i>
              <p class="mt-3">Keranjang belanja kosong</p>
            </div>

            <div v-else>
              <div class="table-responsive mb-3">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in cart" :key="index">
                      <td>{{ item.nama }}</td>
                      <td>{{ item.qty }}</td>
                      <td>{{ formatRupiah(item.harga) }}</td>
                      <td>{{ formatRupiah(item.subtotal) }}</td>
                      <td>
                        <button @click="removeFromCart(index)" class="btn btn-sm btn-danger">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="border-top pt-3 mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <strong>Total:</strong>
                  <strong class="text-success fs-5">Rp {{ formatRupiah(totalBelanja) }}</strong>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button @click="printStruk" class="btn btn-success">
                  <i class="bi bi-printer me-2"></i>
                  Cetak Struk
                </button>
                <button @click="clearCart" class="btn btn-outline-danger">
                  <i class="bi bi-trash me-2"></i>
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Area Cetak (Hidden) -->
    <div id="printArea" style="display: none;">
      <!-- Barcode Print Area -->
      <div id="barcodePrint" class="print-content">
        <div style="text-align: center; padding: 20px;">
          <h3 style="margin-bottom: 10px;">{{ selectedProduk?.namaProduk }}</h3>
          <div id="barcodeForPrint"></div>
          <h4 style="margin-top: 10px;">Rp {{ formatRupiah(selectedProduk?.harga || 0) }}</h4>
        </div>
      </div>

      <!-- Struk Print Area -->
      <div id="strukPrint" class="print-content">
        <div style="width: 300px; margin: 0 auto; padding: 20px; font-family: monospace;">
          <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            <h2 style="margin: 0;">TOKO UMKM</h2>
            <p style="margin: 5px 0;">Jl. Contoh No. 123</p>
            <p style="margin: 5px 0;">Telp: 0812-3456-7890</p>
          </div>
          
          <div style="margin-bottom: 10px;">
            <p style="margin: 2px 0;">Tanggal: {{ currentDate }}</p>
            <p style="margin: 2px 0;">Kasir: Admin</p>
          </div>

          <div style="border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            <table style="width: 100%; font-size: 12px;">
              <tbody>
                <tr v-for="item in cart" :key="item.id" style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 5px 0;">{{ item.nama }}</td>
                  <td style="text-align: right;">{{ item.qty }}x</td>
                  <td style="text-align: right;">{{ formatRupiah(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="text-align: right; font-weight: bold; font-size: 14px;">
            <p style="margin: 5px 0;">TOTAL: Rp {{ formatRupiah(totalBelanja) }}</p>
          </div>

          <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px dashed #000;">
            <p style="margin: 5px 0;">Terima Kasih</p>
            <p style="margin: 5px 0;">Selamat Berbelanja Kembali</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import JsBarcode from 'jsbarcode';

export default {
  name: 'BarcodeView',
  data() {
    return {
      produkList: [],
      selectedProdukId: '',
      selectedProduk: null,
      cart: [],
      cartProdukId: '',
      cartQty: 1
    }
  },
  computed: {
    totalBelanja() {
      return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
    },
    currentDate() {
      return new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.loadProduk();
  },
  methods: {
    async loadProduk() {
      try {
        const response = await api.produk.getAll();
        this.produkList = response.data;
      } catch (error) {
        console.error('Error loading produk:', error);
      }
    },

    generateBarcode() {
      const produk = this.produkList.find(p => p.id == this.selectedProdukId);
      if (produk) {
        this.selectedProduk = produk;
        this.$nextTick(() => {
          // Generate barcode menggunakan ID produk
          const barcodeValue = String(produk.id).padStart(12, '0');
          JsBarcode('#barcode', barcodeValue, {
            format: 'CODE128',
            width: 2,
            height: 80,
            displayValue: true,
            fontSize: 16
          });
        });
      }
    },

    addToCart() {
      if (!this.cartProdukId || this.cartQty < 1) {
        alert('Pilih produk dan masukkan jumlah yang valid!');
        return;
      }

      const produk = this.produkList.find(p => p.id == this.cartProdukId);
      if (produk) {
        const existingIndex = this.cart.findIndex(item => item.id === produk.id);
        
        if (existingIndex > -1) {
          this.cart[existingIndex].qty += this.cartQty;
          this.cart[existingIndex].subtotal = this.cart[existingIndex].qty * this.cart[existingIndex].harga;
        } else {
          this.cart.push({
            id: produk.id,
            nama: produk.namaProduk,
            harga: produk.harga,
            qty: this.cartQty,
            subtotal: produk.harga * this.cartQty
          });
        }

        this.cartProdukId = '';
        this.cartQty = 1;
      }
    },

    removeFromCart(index) {
      this.cart.splice(index, 1);
    },

    clearCart() {
      if (confirm('Kosongkan keranjang belanja?')) {
        this.cart = [];
      }
    },

    printBarcode() {
      if (!this.selectedProduk) return;

      const barcodeValue = String(this.selectedProduk.id).padStart(12, '0');
      
      // Buat SVG element langsung di memory
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      
      JsBarcode(svgElement, barcodeValue, {
        format: 'CODE128',
        width: 3,
        height: 100,
        displayValue: true,
        fontSize: 20
      });

      const printWindow = window.open('', '', 'width=600,height=400');
      printWindow.document.write('<html><head><title>Cetak Barcode</title>');
      printWindow.document.write('<style>body { font-family: Arial; } .print-content { padding: 20px; text-align: center; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<div style="text-align: center; padding: 20px;">');
      printWindow.document.write('<h3 style="margin-bottom: 10px;">' + this.selectedProduk.namaProduk + '</h3>');
      printWindow.document.write(svgElement.outerHTML);
      printWindow.document.write('<h4 style="margin-top: 10px;">Rp ' + this.formatRupiah(this.selectedProduk.harga) + '</h4>');
      printWindow.document.write('</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    },

    printStruk() {
      if (this.cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
      }

      const printWindow = window.open('', '', 'width=400,height=600');
      printWindow.document.write('<html><head><title>Struk Belanja</title>');
      printWindow.document.write('<style>body { font-family: monospace; margin: 0; padding: 20px; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(document.getElementById('strukPrint').innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    },

    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    }
  }
}
</script>

<style scoped>
.barcode-page {
  padding: 20px;
}

.barcode-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.product-info {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

@media print {
  .print-content {
    page-break-after: always;
  }
}
</style>