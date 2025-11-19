<template>
  <div id="app">
    <AppNavbar v-if="showLayout" />
    <div :class="{ 'container-fluid': showLayout }">
      <div class="row">
        <AppSidebar v-if="showLayout" />
        <main :class="mainContentClass">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'
import AppSidebar from './components/AppSidebar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppSidebar
  },
  computed: {
    showLayout() {
      return this.$route.meta.requiresAuth;
    },
    mainContentClass() {
      return this.showLayout ? 'col-md-9 ms-sm-auto col-lg-10 px-md-4' : '';
    }
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

main {
  padding-top: 20px;
  min-height: 100vh;
}
main.col-md-9 {
  background-color: #f8f9fa; /* Hanya beri background jika layout utama aktif */
}
</style>