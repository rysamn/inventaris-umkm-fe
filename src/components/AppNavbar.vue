<template>
  <nav class="navbar navbar-dark bg-primary sticky-top shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <i class="bi bi-box-seam me-2 fs-4"></i>
        <span class="fw-bold">Sistem Inventaris UMKM</span>
      </a>
      <div class="d-flex align-items-center text-white">
        <span class="me-3">
          <i class="bi bi-person-circle me-2"></i>
          <span class="d-none d-md-inline">TIM 6 - XII RPL 1</span>
        </span>
        <button class="btn btn-outline-light btn-sm">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar'
}
</script>

<style scoped>
.navbar {
  z-index: 1030;
}
</style>