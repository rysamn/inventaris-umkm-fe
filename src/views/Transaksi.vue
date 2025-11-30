<template>
  <div class="transaksi-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-receipt text-primary"></i> Riwayat Transaksi
      </h2>
      <button @click="loadData" class="btn btn-outline-primary">
        <i class="bi bi-arrow-clockwise"></i> Refresh
      </button>
    </div>

    <!-- Filter -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Cari invoice, pelanggan..."
            >
          </div>
          <div class="col-md-3">
            <input 
              v-model="filterTanggal" 
              type="date" 
              class="form-control"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Transaksi -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="filteredTransaksi.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-3">Belum ada transaksi</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>No. Invoice</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Kasir</th>
                <th>Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredTransaksi" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>INV-{{ String(item.id).padStart(6, '0') }}</strong>
                </td>
                <td>{{ formatTanggal(item.tanggal) }}</td>
                <td>{{ item.namaPelanggan || 'Umum' }}</td>
                <td>{{ item.namaPengguna }}</td>
                <td class="fw-bold text-success">Rp {{ formatRupiah(item.total) }}</td>
                <td> 
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="showDetail(item)" 
                      class="btn btn-outline-primary"
                      title="Detail"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      @click="cetakStruk(item.id)" 
                      class="btn btn-outline-success"
                      title="Cetak Struk"
                    >
                      <i class="bi bi-printer"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && transaksiList.length > 0" class="d-flex justify-content-end align-items-center mt-3">
          <span class="me-3 text-muted">Halaman {{ currentPage + 1 }}</span>
          <div class="btn-group">
            <button 
              @click="changePage(currentPage - 1)" 
              class="btn btn-outline-secondary"
              :disabled="currentPage === 0"
            >
              <i class="bi bi-chevron-left"></i> Sebelumnya
            </button>
            <button 
              @click="changePage(currentPage + 1)" 
              class="btn btn-outline-secondary"
              :disabled="transaksiList.length < pageSize"
            >
              Selanjutnya <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal Detail -->
    <div class="modal fade" id="modalDetail" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-receipt me-2"></i>
              Detail Transaksi
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedTransaksi">
            <div class="row mb-3">
              <div class="col-md-6">
                <p class="mb-1"><strong>No. Invoice:</strong> INV-{{ String(selectedTransaksi.id).padStart(6, '0') }}</p>
                <p class="mb-1"><strong>Tanggal:</strong> {{ formatTanggal(selectedTransaksi.tanggal) }}</p>
                <p class="mb-1"><strong>Pelanggan:</strong> {{ selectedTransaksi.namaPelanggan || 'Umum' }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1"><strong>Kasir:</strong> {{ selectedTransaksi.namaPengguna }}</p>
              </div>
            </div>

            <h6 class="mb-3">Item Transaksi:</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detail in selectedTransaksi.detailPenjualan" :key="detail.id">
                    <td>{{ detail.namaProduk }}</td>
                    <td>{{ detail.jumlah }}</td>
                    <td>Rp {{ formatRupiah(detail.harga) }}</td>
                    <td>Rp {{ formatRupiah(detail.subtotal) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end"><strong>TOTAL:</strong></td>
                    <td><strong>Rp {{ formatRupiah(selectedTransaksi.total) }}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="cetakStruk(selectedTransaksi.id)" class="btn btn-success">
              <i class="bi bi-printer me-2"></i>
              Cetak Struk
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Tutup
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
  name: 'TransaksiView',
  data() {
    return {
      transaksiList: [],
      loading: false,
      searchQuery: '',
      filterTanggal: '',
      selectedTransaksi: null,
      modal: null,
      currentPage: 0,
      pageSize: 10,
      hasNextPage: true
    }
  },
  computed: {
    filteredTransaksi() {
      let result = this.transaksiList;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(t => 
          String(t.id).includes(query) ||
          (t.namaPelanggan && t.namaPelanggan.toLowerCase().includes(query)) ||
          (t.namaPengguna && t.namaPengguna.toLowerCase().includes(query))
        );
      }

      if (this.filterTanggal) {
        result = result.filter(t => {
          const tanggalTransaksi = new Date(t.tanggal).toISOString().split('T')[0];
          return tanggalTransaksi === this.filterTanggal;
        });
      }

      return result;
    }
  },
  mounted() {
    this.loadData();
    this.modal = new Modal(document.getElementById('modalDetail'));
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const response = await api.penjualan.getAll(this.currentPage, this.pageSize);
        this.transaksiList = response.data;
      } catch (error) {
        console.error('Error loading transaksi:', error);
        alert('Gagal memuat data transaksi');
      } finally {
        this.loading = false;
      }
    },

    changePage(page) {
      this.currentPage = page;
      this.loadData();
    },

    async showDetail(transaksi) {
      try {
        const response = await api.penjualan.getById(transaksi.id);
        this.selectedTransaksi = response.data;
        this.modal.show();
      } catch (error) {
        console.error('Error loading detail:', error);
        alert('Gagal memuat detail transaksi');
      }
    },

    async cetakStruk(id) {
      try {
        const response = await fetch(`http://localhost:8080/api/invoice/print/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Gagal memuat struk');
        }
        const html = await response.text();
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        if (!printWindow) {
          alert('Popup diblokir. Mohon izinkan popup untuk situs ini.');
          return;
        }
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = function() {
          printWindow.print();
        };
      } catch (error) {
        alert(error.message);
      }
    },

    formatTanggal(tanggal) {
      return new Date(tanggal).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    }
  }
}
</script>

<style scoped>
.transaksi-page {
  padding: 20px;
}
</style>