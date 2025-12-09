<template>
  <div id="app">
    <AppNavbar v-if="showLayout" />

    <div v-if="showLayout" class="d-flex">
      <AppSidebar
        :isCollapsed="isCollapsed"
        @toggle="isCollapsed = !isCollapsed"
      />

      <main class="content" :class="{ collapsed: isCollapsed }">
        <router-view />
      </main>
    </div>

    <router-view v-else />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'
import AppSidebar from './components/AppSidebar.vue'

export default {
  components: { AppNavbar, AppSidebar },
  data() {
    return {
      isCollapsed: false
    }
  },
  computed: {
    showLayout() {
      return this.$route.meta.requiresAuth
    }
  }
}
</script>

<style>
.content {
  flex: 1;
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
  transition: margin-left 0.3s;
}
</style>
