<template>
  <div id="app">
    <AppNavbar />
    <div class="container-fluid">
      <div class="row">
        <AppSidebar />
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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
  background-color: #f8f9fa;
}
</style>