<template>
    <div>
        <video ref="webCam" autoplay></video>
    </div>
    <label for="camera-select">Select Camera:</label>
    <select id="camera-select" v-model="selectedDeviceId" @change="changeCamera">
        <option v-for="device in videoInputDevices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Camera ${device.deviceId}` }}
        </option>
    </select>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { barcodeReader } from '@/services/BarcodeScanner';
import { useRouter } from 'vue-router';
import router from '@/router';

export default {
    name: 'ScannerPage',
    
    setup() {
        const webCam = ref<HTMLVideoElement | null>(null);
        const selectedDeviceId = null;
        const constraints = {
            video: {
                width: 1280,
                height: 720,
            },
        };

        onMounted(() => {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                if (webCam.value) {
                    webCam.value.srcObject = stream;
                    barcodeReader(webCam.value, selectedDeviceId).then((barCodeNumber) => {
                        if (barCodeNumber) {
                            router.push({ path: '/Search', query: { string: barCodeNumber } });
                        }
                    }).catch((error) => {
                        console.error('Error scanning barcode:', error);
                    });
                }
            }).catch((error) => {
                console.error(error);
                router.push('/Search');
            });
        });

        return {
            webCam,
        };
    },
};
</script>