<template>
  <div class="barcode-scanner">
    <div class="scanner-container">
      <video ref="video" autoplay playsinline></video>
      <canvas ref="canvas" style="display: none;"></canvas>
    </div>
    <div class="scanner-controls mt-3">
      <button @click="startScanner" class="btn btn-primary me-2" :disabled="isScanning">
        <i class="bi bi-play-circle me-2"></i>
        Start Scanner
      </button>
      <button @click="stopScanner" class="btn btn-danger" :disabled="!isScanning">
        <i class="bi bi-stop-circle me-2"></i>
        Stop Scanner
      </button>
    </div>
    <div v-if="scannedCode" class="alert alert-success mt-3">
      <strong>Barcode Terdeteksi:</strong> {{ scannedCode }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarcodeScanner',
  data() {
    return {
      isScanning: false,
      scannedCode: null,
      stream: null
    }
  },
  methods: {
    async startScanner() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        this.$refs.video.srcObject = this.stream;
        this.isScanning = true;
        this.scanBarcode();
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
      }
    },
    
    stopScanner() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.isScanning = false;
      }
    },
    
    scanBarcode() {
      console.log('Scanning barcode...');
    }
  },
  beforeUnmount() {
    this.stopScanner();
  }
}
</script>

<style scoped>
.scanner-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background-color: #000;
}

video {
  width: 100%;
  display: block;
}

.scanner-controls {
  text-align: center;
}
</style>