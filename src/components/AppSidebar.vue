<template>
  <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/produk" class="nav-link" active-class="active">
            <i class="bi bi-box me-2"></i>
            Produk
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/pemasok" class="nav-link" active-class="active">
            <i class="bi bi-truck me-2"></i>
            Pemasok
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/pelanggan" class="nav-link" active-class="active">
            <i class="bi bi-people me-2"></i>
            Pelanggan
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/barcode" class="nav-link" active-class="active">
            <i class="bi bi-upc-scan me-2"></i>
            Barcode & Struk
          </router-link>
        </li>
      </ul>

      <hr class="my-3">

      <div class="px-3">
        <p class="text-muted small mb-1">Fitur Wajib MVP:</p>
        <div class="d-flex flex-wrap gap-1">
          <span class="badge bg-success text-white">CRUD</span>
          <span class="badge bg-info text-white">Dashboard</span>
          <span class="badge bg-warning text-dark">Barcode</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppSidebar'
}
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
}

.nav-link {
  color: #495057;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #e9ecef;
  color: #0d6efd;
}

.nav-link.active {
  background-color: #0d6efd;
  color: white;
  font-weight: 500;
}

.nav-link i {
  width: 20px;
}
</style>