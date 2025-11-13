// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'

// Import Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Custom CSS jika diperlukan
import './assets/custom.css'

const app = createApp(App)

app.use(router)

app.mount('#app')